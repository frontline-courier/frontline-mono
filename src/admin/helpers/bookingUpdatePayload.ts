import { OPTIONAL_CLEARABLE_STRING_FIELDS } from '../constants/bookingFields';
import { normalizeBookingPayload } from './apiValidation';

const INTERNATIONAL_SHIPMENT_MODE = 2;

/**
 * Returns true when a field value was explicitly cleared by the user (sent as ''
 * or null), as opposed to simply being absent from the request.
 *
 * We use an explicit equality check rather than a generic falsy check so that
 * numeric 0 or boolean false are never misidentified as "cleared".
 */
function isClearedString(value: unknown): boolean {
  return value === '' || value === null;
}

/**
 * Derives the MongoDB $set and $unset payloads for a booking update.
 *
 * Extracting this logic from the route handler keeps it pure and testable
 * without an HTTP layer.
 */
export function buildBookingUpdatePayload(payload: Record<string, unknown>): {
  $set: Record<string, unknown>;
  $unset: Record<string, ''>;
} {
  const data = normalizeBookingPayload(payload, true);

  const $unset: Record<string, ''> = {
    // Legacy fields no longer in the schema — always remove
    coCourier: '',
    billAmount: '',
    deliveryOfficeLocation: '',
  };

  // --- importDuty ---
  // Remove when shipmentMode changes away from international …
  if (data.shipmentMode !== undefined && data.shipmentMode !== INTERNATIONAL_SHIPMENT_MODE) {
    $unset.importDuty = '';
  // … or when the user explicitly clears it while staying international.
  } else if ('importDuty' in payload && isClearedString(payload.importDuty) && !('importDuty' in data)) {
    $unset.importDuty = '';
  }

  // --- paymentMode + credit cascade ---
  const paymentModeCleared =
    'paymentMode' in payload &&
    isClearedString(payload.paymentMode) &&
    !('paymentMode' in data);

  if (paymentModeCleared) {
    // User removed the payment mode entirely — clear it and all dependent fields.
    $unset.paymentMode = '';
    $unset.creditStatus = '';
    $unset.paidAmount = '';
    $unset.dueAmount = '';
    $unset.creditNotes = '';
    // creditNotes has no cross-field validation guard so normalizeBookingPayload can
    // include it in data even when paymentMode is absent. Remove it from $set to
    // avoid a MongoDB "conflicting update paths" error.
    delete data.creditStatus;
    delete data.dueAmount;
    delete data.creditNotes;
  } else if (data.paymentMode !== undefined && data.paymentMode !== 'Credit') {
    // Payment mode changed to a non-Credit value — remove credit-only fields.
    $unset.creditStatus = '';
    $unset.paidAmount = '';
    $unset.dueAmount = '';
    $unset.creditNotes = '';
    // Same as above: creditNotes may still be in data; remove it from $set.
    delete data.creditStatus;
    delete data.dueAmount;
    delete data.creditNotes;
  }

  // Remove paidAmount / dueAmount when credit status is no longer Pending - Partial.
  if (data.creditStatus !== undefined && data.creditStatus !== 'Pending - Partial') {
    $unset.paidAmount = '';
    $unset.dueAmount = '';
    delete data.dueAmount;
  }

  // --- generic optional string fields ---
  // normalizeBookingPayload converts '' → undefined via ensureTrimmedString, so
  // cleared values never appear in $set. Detect explicit clears here and move
  // them to $unset so MongoDB actually removes the stale value.
  for (const field of OPTIONAL_CLEARABLE_STRING_FIELDS) {
    if (field in payload && isClearedString(payload[field]) && !(field in data)) {
      $unset[field] = '';
    }
  }

  return { $set: data, $unset };
}
