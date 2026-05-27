/**
 * Optional string fields on a booking that a user can intentionally clear (set to empty).
 *
 * Used by the update handler to distinguish "field not sent" (no-op) from
 * "field explicitly cleared" (should $unset in MongoDB).
 *
 * Keep in sync with the optional string fields in normalizeBookingPayload.
 * paymentMode and importDuty are NOT here — they have dedicated business-logic
 * guards that cascade into related field clean-up.
 */
export const OPTIONAL_CLEARABLE_STRING_FIELDS = [
  'referenceNumber',
  'thirdPartyNumber',
  'branch',
  'bookedBy',
  'creditNotes',
  'remarks',
  'internalRemarks',
  'additionalContacts',
  'additionalWeights',
  'additionalLeaf',
] as const;

export type OptionalClearableStringField = (typeof OPTIONAL_CLEARABLE_STRING_FIELDS)[number];
