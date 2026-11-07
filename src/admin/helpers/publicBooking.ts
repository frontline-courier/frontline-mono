/**
 * Fields that are safe to expose through the unauthenticated public tracking
 * endpoint. Keep this list minimal and only add fields that the tracking UI
 * actually renders.
 */
export const PUBLIC_BOOKING_FIELDS = [
  '_id',
  'awbNumber',
  'referenceNumber',
  'bookedDate',
  'origin',
  'destination',
  'doxType',
  'shipmentMode',
  'transportMode',
  'shipmentStatus',
  'receivedPerson',
  'receivedPersonRelation',
  'deliveryOfficeAddress',
  'remarks',
  'delivery',
] as const;

export type PublicBookingField = (typeof PUBLIC_BOOKING_FIELDS)[number];

export function getCourierModeDisplay(mode: number | string | null | undefined): string {
  const numericMode = Number(mode);
  if (numericMode === 2) return 'link';
  if (numericMode === 3) return 'api';
  return 'internal';
}

/**
 * Build the public tracking response from a full booking document.
 * Unknown/private fields are dropped rather than blacklisted individually so
 * that future schema additions do not accidentally leak through this endpoint.
 */
export function toPublicBooking(
  doc: Record<string, any> | null | undefined,
  courier?: Record<string, any> | null,
) {
  if (!doc) {
    return null;
  }

  const result: Record<string, unknown> = {};

  for (const field of PUBLIC_BOOKING_FIELDS) {
    if (doc[field] !== undefined) {
      result[field] = doc[field];
    }
  }

  if (courier) {
    result.courierName = courier.Courier ?? '';
    result.courierTrack = courier.Track ?? '';
    result.courierMode = getCourierModeDisplay(courier.Mode);
  }

  return result;
}
