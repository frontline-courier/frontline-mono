import assert from 'node:assert/strict';
import test from 'node:test';
import { buildBookingsQuery } from '../pages/api/bookings/index';

test('adds exact-match paymentMode filter when provided', () => {
  const query = buildBookingsQuery({ paymentMode: 'Pending' });

  assert.deepEqual(query, { paymentMode: 'Pending' });
});

test('does not add paymentMode filter when empty', () => {
  const query = buildBookingsQuery({ paymentMode: '' });

  assert.ok(!Object.prototype.hasOwnProperty.call(query, 'paymentMode'));
});

test('combines paymentMode with other bookings filters', () => {
  const query = buildBookingsQuery({
    awb: 'AWB123',
    courier: 7,
    mode: 2,
    status: 'Booked',
    paymentMode: 'Pending',
  });

  assert.deepEqual(query, {
    awbNumber: 'AWB123',
    courier: 7,
    shipmentMode: 2,
    shipmentStatus: { $regex: 'Booked', $options: 'i' },
    paymentMode: 'Pending',
  });
});
