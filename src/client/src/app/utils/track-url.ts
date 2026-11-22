export type TrackableBooking = {
  courierMode?: string | null;
  courierTrack?: string | null;
  awbNumber?: string | null;
  referenceNumber?: string | null;
};

export type BuildCourierTrackUrlOptions = {
  adminApiUrl?: string | null;
};

/**
 * Build the external courier tracking URL.
 *
 * - `link`      -> the courier's deep link expects the reference number
 * - `internal`  -> AWB number
 * - `api`       -> no client-side link
 * - `resolver`  -> AWB number; `courierTrack` is a path on the admin API that
 *                  resolves the courier's real tracking URL server-side
 *
 * Returns an empty string when the required number is missing, so the UI can
 * show the "reference not available" message instead of linking to a broken URL.
 */
export function buildCourierTrackUrl(
  booking: TrackableBooking | null | undefined,
  options: BuildCourierTrackUrlOptions = {},
): string {
  const mode = booking?.courierMode ?? 'internal';
  const rawUrl = booking?.courierTrack?.trim() ?? '';

  if (!rawUrl || mode === 'api') {
    return '';
  }

  // Resolver links are paths on the admin API. The client owns the API origin,
  // so the stored value stays portable between environments.
  if (mode === 'resolver' && rawUrl.startsWith('/')) {
    const adminApiUrl = options.adminApiUrl?.trim();

    if (!adminApiUrl) {
      return '';
    }

    return buildFromTemplate(
      `${adminApiUrl.replace(/\/+$/, '')}${rawUrl}`,
      booking?.awbNumber,
    );
  }

  // Static courier page: nothing to interpolate.
  if (!rawUrl.includes('<AWB>')) {
    return rawUrl;
  }

  const trackingNumber = mode === 'link' ? booking?.referenceNumber : booking?.awbNumber;

  return buildFromTemplate(rawUrl, trackingNumber);
}

function buildFromTemplate(template: string, trackingNumber: string | null | undefined): string {
  if (!template.includes('<AWB>')) {
    return template;
  }

  if (
    trackingNumber === null ||
    trackingNumber === undefined ||
    String(trackingNumber).trim() === ''
  ) {
    return '';
  }

  return template.replace('<AWB>', encodeURIComponent(String(trackingNumber).trim()));
}
