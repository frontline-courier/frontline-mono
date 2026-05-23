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
