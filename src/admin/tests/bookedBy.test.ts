import assert from 'node:assert/strict';
import test from 'node:test';
import {
  ValidationError,
  normalizeBookedByPayload,
  normalizeBookedByUpdatePayload,
  normalizeBookingPayload,
} from '../helpers/apiValidation';
import { isBookedByActive } from '../helpers/bookedBy';

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

test('normalizeBookedByUpdatePayload accepts a name-only update', () => {
  assert.deepEqual(normalizeBookedByUpdatePayload({ name: '  Kavitha  ' }), { name: 'Kavitha' });
});

test('normalizeBookedByUpdatePayload accepts an isActive-only update', () => {
  assert.deepEqual(normalizeBookedByUpdatePayload({ isActive: false }), { isActive: false });
  assert.deepEqual(normalizeBookedByUpdatePayload({ isActive: true }), { isActive: true });
});

test('normalizeBookedByUpdatePayload rejects an empty update', () => {
  assert.throws(
    () => normalizeBookedByUpdatePayload({}),
    (error: unknown) => {
      assert.ok(error instanceof ValidationError);
      assert.equal(error.message, 'At least one of name or isActive is required.');
      return true;
    },
  );
});

test('normalizeBookedByUpdatePayload rejects a non-boolean isActive', () => {
  assert.throws(
    () => normalizeBookedByUpdatePayload({ isActive: 'false' }),
    (error: unknown) => {
      assert.ok(error instanceof ValidationError);
      assert.equal(error.message, 'isActive must be a boolean.');
      return true;
    },
  );
});

test('isBookedByActive treats documents without the flag as active', () => {
  assert.equal(isBookedByActive({ isActive: true }), true);
  assert.equal(isBookedByActive({ isActive: false }), false);
  assert.equal(isBookedByActive({}), true);
  assert.equal(isBookedByActive(null), true);
  assert.equal(isBookedByActive(undefined), true);
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
