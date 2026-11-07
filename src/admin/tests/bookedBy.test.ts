import assert from 'node:assert/strict';
import test from 'node:test';
import { ValidationError, normalizeBookedByPayload, normalizeBookingPayload } from '../helpers/apiValidation';

test('normalizeBookedByPayload trims and requires a name', () => {
  assert.deepEqual(normalizeBookedByPayload({ name: '  Kavitha  ' }), { name: 'Kavitha' });

  assert.throws(
    () => normalizeBookedByPayload({ name: '   ' }),
    (error: unknown) => {
      assert.ok(error instanceof ValidationError);
      assert.equal(error.message, 'Name is required.');
      return true;
    },
  );
});

test('booking payload accepts any trimmed bookedBy value', () => {
  const normalized = normalizeBookingPayload({
    awbNumber: 'AWB12345',
    bookedDate: '2026-05-23T10:00:00.000Z',
    courier: 12,
    shipmentMode: 1,
    bookedBy: '  New User  ',
  });

  assert.equal(normalized.bookedBy, 'New User');
});

test('booking payload rejects a non-string bookedBy', () => {
  assert.throws(
    () => {
      normalizeBookingPayload({
        awbNumber: 'AWB12345',
        bookedDate: '2026-05-23T10:00:00.000Z',
        courier: 12,
        shipmentMode: 1,
        bookedBy: 42,
      });
    },
    (error: unknown) => {
      assert.ok(error instanceof ValidationError);
      assert.equal(error.message, 'Booked By must be a string.');
      return true;
    },
  );
});
