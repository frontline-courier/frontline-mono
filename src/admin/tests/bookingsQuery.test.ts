import assert from 'node:assert/strict';
import test from 'node:test';
import { buildBookingsQuery } from '../pages/api/bookings/index';

test('adds exact-match paymentMode filter when provided', () => {
  const query = buildBookingsQuery({ paymentMode: 'Credit' });

  assert.deepEqual(query, { paymentMode: 'Credit' });
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
    paymentMode: 'Credit',
    creditStatus: 'Pending - Partial',
  });

  assert.deepEqual(query, {
    awbNumber: 'AWB123',
    courier: 7,
    shipmentMode: 2,
    shipmentStatus: { $regex: 'Booked', $options: 'i' },
    paymentMode: 'Credit',
    creditStatus: 'Pending - Partial',
  });
});

test('does not add creditStatus filter when empty', () => {
  const query = buildBookingsQuery({ creditStatus: '' });

  assert.ok(!Object.prototype.hasOwnProperty.call(query, 'creditStatus'));
});
