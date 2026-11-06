export type TrackableBooking = {
  courierMode?: string | null;
  courierTrack?: string | null;
  awbNumber?: string | null;
  referenceNumber?: string | null;
};

/**
 * Build the external courier tracking URL.
 *
 * - `link`      -> the courier's deep link expects the reference number
 * - `internal`  -> AWB number
 * - `api`       -> no client-side link
 *
 * Returns an empty string when the required number is missing, so the UI can
 * show the "reference not available" message instead of linking to a broken URL.
 */
export function buildCourierTrackUrl(booking: TrackableBooking | null | undefined): string {
  const mode = booking?.courierMode ?? 'internal';
  const rawUrl = booking?.courierTrack?.trim() ?? '';

  if (!rawUrl || mode === 'api') {
    return '';
  }

  // Static courier page: nothing to interpolate.
  if (!rawUrl.includes('<AWB>')) {
    return rawUrl;
  }

  const trackingNumber = mode === 'link' ? booking?.referenceNumber : booking?.awbNumber;

  if (
    trackingNumber === null ||
    trackingNumber === undefined ||
    String(trackingNumber).trim() === ''
  ) {
    return '';
  }

  return rawUrl.replace('<AWB>', encodeURIComponent(String(trackingNumber).trim()));
}
