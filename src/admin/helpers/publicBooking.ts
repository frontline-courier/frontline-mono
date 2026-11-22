import {
  isShreeTirupatiCourier,
  SHREE_TIRUPATI_RESOLVER_PATH,
} from './shreeTirupatiTracking';

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
  'importDuty',
  'insured',
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
  if (numericMode === 4) return 'resolver';
  return 'internal';
}

/**
 * Some couriers reject direct deep links and only expose a tracking page after
 * a server-side form POST. Those couriers use the admin API as a resolver and
 * are rendered like external links by the client.
 */
export function getPublicCourierTracking(
  courier: Record<string, any> | null | undefined,
): { courierTrack: string; courierMode: string } {
  if (isShreeTirupatiCourier(courier)) {
    return {
      courierTrack: SHREE_TIRUPATI_RESOLVER_PATH,
      courierMode: 'resolver',
    };
  }

  return {
    courierTrack: courier?.Track ?? '',
    courierMode: getCourierModeDisplay(courier?.Mode),
  };
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
    const tracking = getPublicCourierTracking(courier);

    result.courierName = courier.Courier ?? '';
    result.courierTrack = tracking.courierTrack;
    result.courierMode = tracking.courierMode;
  }

  return result;
}
