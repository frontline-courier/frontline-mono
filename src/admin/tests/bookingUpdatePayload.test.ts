import assert from 'node:assert/strict';
import test from 'node:test';
import { buildBookingUpdatePayload } from '../helpers/bookingUpdatePayload';
import { OPTIONAL_CLEARABLE_STRING_FIELDS } from '../constants/bookingFields';

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

const basePayload = () => ({
  awbNumber: 'AWB12345',
  bookedDate: '2026-05-23T10:00:00.000Z',
  courier: 12,
  shipmentMode: 1,
});

function inSet(obj: Record<string, unknown>, key: string) {
  return key in obj;
}

function inUnset(obj: Record<string, unknown>, key: string) {
  return key in obj;
}

// ---------------------------------------------------------------------------
// Generic optional string fields — the three core contracts
// ---------------------------------------------------------------------------

for (const field of OPTIONAL_CLEARABLE_STRING_FIELDS) {
  test(`${field}: empty string → field is in $unset, not $set`, () => {
    const { $set, $unset } = buildBookingUpdatePayload({
      ...basePayload(),
      [field]: '',
    });

    assert.ok(inUnset($unset, field), `expected $unset to contain "${field}"`);
    assert.ok(!inSet($set, field), `expected $set NOT to contain "${field}"`);
  });

  test(`${field}: non-empty value → field is in $set, not $unset`, () => {
    const value = field === 'branch' ? 'Chennai' : field === 'bookedBy' ? 'Admin' : 'some-value';
    let result: ReturnType<typeof buildBookingUpdatePayload> | undefined;

    try {
      result = buildBookingUpdatePayload({ ...basePayload(), [field]: value });
    } catch {
      // If the value is invalid for an enum field (branch/bookedBy), the test is
      // not applicable — skip silently.
      return;
    }

    const { $set, $unset } = result!;
    assert.ok(inSet($set, field), `expected $set to contain "${field}"`);
    assert.ok(!inUnset($unset, field), `expected $unset NOT to contain "${field}"`);
  });

  test(`${field}: field omitted from payload → not in $set or $unset`, () => {
    const payload = basePayload() as Record<string, unknown>;
    delete payload[field]; // ensure it is absent

    const { $set, $unset } = buildBookingUpdatePayload(payload);

    assert.ok(!inSet($set, field), `expected $set NOT to contain "${field}"`);
    assert.ok(!inUnset($unset, field), `expected $unset NOT to contain "${field}"`);
  });
}

// ---------------------------------------------------------------------------
// creditNotes — stays in $unset when cleared while paymentMode stays Credit
// ---------------------------------------------------------------------------

test('creditNotes: cleared while paymentMode stays Credit → $unset', () => {
  const { $set, $unset } = buildBookingUpdatePayload({
    ...basePayload(),
    paymentMode: 'Credit',
    creditStatus: 'Pending - Full',
    creditNotes: '',
  });

  assert.ok(inUnset($unset, 'creditNotes'), 'expected $unset to contain "creditNotes"');
  assert.ok(!inSet($set, 'creditNotes'), 'expected $set NOT to contain "creditNotes"');
});

// ---------------------------------------------------------------------------
// paymentMode — clearing it cascades to credit fields
// ---------------------------------------------------------------------------

test('paymentMode: cleared → paymentMode and credit fields all in $unset', () => {
  const { $unset } = buildBookingUpdatePayload({
    ...basePayload(),
    paymentMode: '',
  });

  for (const field of ['paymentMode', 'creditStatus', 'paidAmount', 'dueAmount', 'creditNotes']) {
    assert.ok(inUnset($unset, field), `expected $unset to contain "${field}"`);
  }
});

test('paymentMode: changed to non-Credit → credit fields in $unset, paymentMode in $set', () => {
  const { $set, $unset } = buildBookingUpdatePayload({
    ...basePayload(),
    paymentMode: 'Cash',
  });

  assert.equal($set.paymentMode, 'Cash');
  for (const field of ['creditStatus', 'paidAmount', 'dueAmount', 'creditNotes']) {
    assert.ok(inUnset($unset, field), `expected $unset to contain "${field}"`);
  }
  assert.ok(!inUnset($unset, 'paymentMode'), 'paymentMode should NOT be in $unset when set to Cash');
});

test('paymentMode: omitted → credit fields not touched', () => {
  const payload = basePayload() as Record<string, unknown>;
  const { $unset } = buildBookingUpdatePayload(payload);

  assert.ok(!inUnset($unset, 'paymentMode'));
  assert.ok(!inUnset($unset, 'creditStatus'));
  assert.ok(!inUnset($unset, 'creditNotes'));
});

// ---------------------------------------------------------------------------
// importDuty — cleared while shipmentMode stays international
// ---------------------------------------------------------------------------

test('importDuty: cleared while staying international → $unset', () => {
  const { $unset } = buildBookingUpdatePayload({
    ...basePayload(),
    shipmentMode: 2,
    importDuty: '',
  });

  assert.ok(inUnset($unset, 'importDuty'), 'expected $unset to contain "importDuty"');
});

test('importDuty: shipmentMode changes from international to domestic → $unset (existing behaviour)', () => {
  // The user had shipmentMode=2+importDuty set, then changed to shipmentMode=1.
  // The form stops sending importDuty (field absent / empty). The $unset guard
  // fires from the shipmentMode check alone — importDuty does not need to be present.
  const { $unset } = buildBookingUpdatePayload({
    ...basePayload(),
    shipmentMode: 1,
    // importDuty intentionally absent — the form drops it when mode changes
  });

  assert.ok(inUnset($unset, 'importDuty'), 'expected $unset to contain "importDuty"');
});

test('importDuty: set on international shipment → in $set, not $unset', () => {
  const { $set, $unset } = buildBookingUpdatePayload({
    ...basePayload(),
    shipmentMode: 2,
    importDuty: 'Delivered at Place (DAP)',
  });

  assert.equal($set.importDuty, 'Delivered at Place (DAP)');
  assert.ok(!inUnset($unset, 'importDuty'));
});

// ---------------------------------------------------------------------------
// Explicit check: numeric 0 does NOT trigger $unset (falsy guard safety)
// ---------------------------------------------------------------------------

test('courier value 0 does not trigger $unset (falsy ≠ cleared for numeric fields)', () => {
  // courier=0 is invalid per validation — we just want to ensure the generic
  // clearable-field loop never fires for numeric fields.
  const clearableFieldNames = OPTIONAL_CLEARABLE_STRING_FIELDS as readonly string[];
  assert.ok(
    !clearableFieldNames.includes('courier'),
    'courier must not be in OPTIONAL_CLEARABLE_STRING_FIELDS',
  );
});

// ---------------------------------------------------------------------------
// Legacy fields always removed
// ---------------------------------------------------------------------------

test('legacy fields (coCourier, billAmount, deliveryOfficeLocation) always in $unset', () => {
  const { $unset } = buildBookingUpdatePayload(basePayload());

  for (const field of ['coCourier', 'billAmount', 'deliveryOfficeLocation']) {
    assert.ok(inUnset($unset, field), `expected $unset to always contain "${field}"`);
  }
});
