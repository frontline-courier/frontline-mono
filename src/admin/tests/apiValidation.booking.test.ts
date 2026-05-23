import assert from 'node:assert/strict';
import test from 'node:test';
import { ValidationError, normalizeBookingPayload } from '../helpers/apiValidation';

const getBaseBookingPayload = () => ({
  awbNumber: 'AWB12345',
  bookedDate: '2026-05-23T10:00:00.000Z',
  courier: 12,
  shipmentMode: 2,
});

test('allows importDuty when shipmentMode is International', () => {
  const normalized = normalizeBookingPayload({
    ...getBaseBookingPayload(),
    importDuty: 'Delivered at Place (DAP)',
  });

  assert.equal(normalized.shipmentMode, 2);
  assert.equal(normalized.importDuty, 'Delivered at Place (DAP)');
});

test('rejects importDuty when shipmentMode is not International', () => {
  assert.throws(
    () => {
      normalizeBookingPayload({
        ...getBaseBookingPayload(),
        shipmentMode: 1,
        importDuty: 'Duty Fee (DP)',
      });
    },
    (error: unknown) => {
      assert.ok(error instanceof ValidationError);
      assert.equal(
        error.message,
        'Import Duty is applicable only for international shipment mode.',
      );
      return true;
    },
  );
});

test('does not include importDuty for non-international shipment mode when omitted', () => {
  const normalized = normalizeBookingPayload({
    ...getBaseBookingPayload(),
    shipmentMode: 3,
  });

  assert.equal(normalized.shipmentMode, 3);
  assert.ok(!Object.prototype.hasOwnProperty.call(normalized, 'importDuty'));
});

test('rejects partial update with importDuty but without shipmentMode', () => {
  assert.throws(
    () => {
      normalizeBookingPayload(
        {
          importDuty: 'Delivered at Place (DAP)',
        },
        true,
      );
    },
    (error: unknown) => {
      assert.ok(error instanceof ValidationError);
      assert.equal(
        error.message,
        'Import Duty is applicable only for international shipment mode.',
      );
      return true;
    },
  );
});

test('allows Credit bookings with Pending - Full credit status', () => {
  const normalized = normalizeBookingPayload({
    ...getBaseBookingPayload(),
    paymentMode: 'Credit',
    creditStatus: 'Pending - Full',
  });

  assert.equal(normalized.paymentMode, 'Credit');
  assert.equal(normalized.creditStatus, 'Pending - Full');
});

test('requires creditStatus when paymentMode is Credit', () => {
  assert.throws(
    () => {
      normalizeBookingPayload({
        ...getBaseBookingPayload(),
        paymentMode: 'Credit',
      });
    },
    (error: unknown) => {
      assert.ok(error instanceof ValidationError);
      assert.equal(error.message, 'Credit Status is required when Payment Mode is Credit.');
      return true;
    },
  );
});

test('requires dueAmount for Pending - Partial credit status', () => {
  assert.throws(
    () => {
      normalizeBookingPayload({
        ...getBaseBookingPayload(),
        paymentMode: 'Credit',
        creditStatus: 'Pending - Partial',
      });
    },
    (error: unknown) => {
      assert.ok(error instanceof ValidationError);
      assert.equal(error.message, 'Due Amount is required when Credit Status is Pending - Partial.');
      return true;
    },
  );
});

test('rejects creditStatus when paymentMode is not Credit', () => {
  assert.throws(
    () => {
      normalizeBookingPayload({
        ...getBaseBookingPayload(),
        paymentMode: 'Cash',
        creditStatus: 'Pending - Full',
      });
    },
    (error: unknown) => {
      assert.ok(error instanceof ValidationError);
      assert.equal(error.message, 'Credit Status is allowed only when Payment Mode is Credit.');
      return true;
    },
  );
});

test('allows dueAmount for Pending - Partial credit status', () => {
  const normalized = normalizeBookingPayload({
    ...getBaseBookingPayload(),
    bookingAmount: 100,
    paymentMode: 'Credit',
    creditStatus: 'Pending - Partial',
    dueAmount: 40,
    creditNotes: 'Customer paid advance',
  });

  assert.equal(normalized.creditStatus, 'Pending - Partial');
  assert.equal(normalized.dueAmount, 40);
  assert.equal(normalized.creditNotes, 'Customer paid advance');
});

test('rejects dueAmount greater than bookingAmount for Pending - Partial credit status', () => {
  assert.throws(
    () => {
      normalizeBookingPayload({
        ...getBaseBookingPayload(),
        bookingAmount: 100,
        paymentMode: 'Credit',
        creditStatus: 'Pending - Partial',
        dueAmount: 140,
      });
    },
    (error: unknown) => {
      assert.ok(error instanceof ValidationError);
      assert.equal(error.message, 'Due Amount cannot exceed Booking Amount.');
      return true;
    },
  );
});
