import assert from 'node:assert/strict';
import test from 'node:test';
import { ValidationError, normalizeBookingStatusPayload } from '../helpers/apiValidation';

const getBaseStatusPayload = () => ({
  statusDate: '2026-05-23T10:00:00.000Z',
  statusId: 'In Transit',
});

test('accepts statusDate with a full UTC ISO string', () => {
  const normalized = normalizeBookingStatusPayload({
    ...getBaseStatusPayload(),
    statusDate: '2026-05-20T04:30:00.000Z',
  });

  assert.ok(normalized.statusDate instanceof Date);
  assert.equal((normalized.statusDate as Date).toISOString(), '2026-05-20T04:30:00.000Z');
});

test('rejects a bare datetime-local statusDate string (no TZ suffix)', () => {
  assert.throws(
    () => {
      normalizeBookingStatusPayload({
        ...getBaseStatusPayload(),
        statusDate: '2026-05-20T10:00',
      });
    },
    (error: unknown) => {
      assert.ok(error instanceof ValidationError);
      assert.match(error.message, /timezone/i);
      return true;
    },
  );
});

test('rejects missing statusDate', () => {
  assert.throws(
    () => {
      normalizeBookingStatusPayload({ statusId: 'In Transit' });
    },
    (error: unknown) => {
      assert.ok(error instanceof ValidationError);
      assert.match(error.message, /Status Date is required/i);
      return true;
    },
  );
});

test('rejects missing statusId', () => {
  assert.throws(
    () => {
      normalizeBookingStatusPayload({ statusDate: '2026-05-23T10:00:00.000Z' });
    },
    (error: unknown) => {
      assert.ok(error instanceof ValidationError);
      assert.match(error.message, /Status is required/i);
      return true;
    },
  );
});

test('includes optional remark when provided', () => {
  const normalized = normalizeBookingStatusPayload({
    ...getBaseStatusPayload(),
    remark: 'Out for delivery',
  });

  assert.equal(normalized.remark, 'Out for delivery');
});

test('omits remark when not provided', () => {
  const normalized = normalizeBookingStatusPayload(getBaseStatusPayload());

  assert.ok(!Object.prototype.hasOwnProperty.call(normalized, 'remark'));
});

test('ignores action field when allowDelete is false', () => {
  // action is only validated when the caller explicitly opts in to delete mode;
  // otherwise it is silently dropped so stray fields cannot cause an error
  const normalized = normalizeBookingStatusPayload(
    { ...getBaseStatusPayload(), action: 'delete' },
    false,
  );

  assert.ok(!Object.prototype.hasOwnProperty.call(normalized, 'action'));
});

test('accepts delete action when allowDelete is true', () => {
  const normalized = normalizeBookingStatusPayload(
    { ...getBaseStatusPayload(), action: 'delete' },
    true,
  );

  assert.equal(normalized.action, 'delete');
});
