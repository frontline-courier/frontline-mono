import assert from 'node:assert/strict';
import test from 'node:test';
import {
  PUBLIC_BOOKING_FIELDS,
  getCourierModeDisplay,
  toPublicBooking,
} from '../helpers/publicBooking';

const fullBooking = () => ({
  _id: 'booking-id',
  awbNumber: 'AWB123',
  referenceNumber: 'REF123',
  bookedDate: '2026-05-23T10:00:00.000Z',
  origin: 'Chennai',
  destination: 'Delhi',
  doxType: 1,
  shipmentMode: 2,
  transportMode: 1,
  shipmentStatus: 'In Transit',
  receivedPerson: 'Receiver',
  receivedPersonRelation: 'Friend',
  deliveryOfficeAddress: 'Office',
  remarks: 'Handle with care',
  delivery: [{ statusId: 'In Transit', statusDate: '2026-05-24T10:00:00.000Z' }],
  courier: 7,
  // Sensitive/private fields that must never be exposed publicly:
  bookingAmount: 1000,
  dueAmount: 500,
  creditStatus: 'Pending - Partial',
  creditNotes: 'private note',
  paymentMode: 'Credit',
  internalRemarks: 'internal only',
  bookedBy: 'Admin',
  branch: 'FCC1',
  createdBy: 'admin@example.com',
  updatedBy: 'admin@example.com',
  additionalContacts: '9999999999',
  shipperName: 'Shipper',
  receiverName: 'Receiver Name',
});

test('returns only allowlisted public fields', () => {
  const publicBooking = toPublicBooking(fullBooking()) as Record<string, unknown>;

  for (const field of PUBLIC_BOOKING_FIELDS) {
    if (fullBooking()[field as keyof ReturnType<typeof fullBooking>] !== undefined) {
      assert.ok(field in publicBooking, `expected public response to include ${field}`);
    }
  }

  for (const privateField of [
    'bookingAmount',
    'dueAmount',
    'creditStatus',
    'creditNotes',
    'paymentMode',
    'internalRemarks',
    'bookedBy',
    'branch',
    'createdBy',
    'updatedBy',
    'additionalContacts',
    'shipperName',
    'receiverName',
    'courier',
  ]) {
    assert.ok(!(privateField in publicBooking), `did not expect ${privateField} in public response`);
  }
});

test('keeps the full delivery timeline', () => {
  const publicBooking = toPublicBooking(fullBooking()) as Record<string, unknown>;

  assert.deepEqual(publicBooking.delivery, fullBooking().delivery);
});

test('enriches with courier details without exposing the courier document', () => {
  const publicBooking = toPublicBooking(fullBooking(), {
    _id: 'courier-id',
    CourierId: 7,
    Courier: 'Test Courier',
    Track: 'https://courier.example/track/<AWB>',
    Mode: 2,
  }) as Record<string, unknown>;

  assert.equal(publicBooking.courierName, 'Test Courier');
  assert.equal(publicBooking.courierTrack, 'https://courier.example/track/<AWB>');
  assert.equal(publicBooking.courierMode, 'link');
  assert.ok(!('courier' in publicBooking), 'did not expect the courier document in the response');
});

test('returns null for a missing booking', () => {
  assert.equal(toPublicBooking(null), null);
  assert.equal(toPublicBooking(undefined), null);
});

test('maps courier modes consistently', () => {
  assert.equal(getCourierModeDisplay(2), 'link');
  assert.equal(getCourierModeDisplay(3), 'api');
  assert.equal(getCourierModeDisplay(1), 'internal');
  assert.equal(getCourierModeDisplay('2'), 'link');
  assert.equal(getCourierModeDisplay(null), 'internal');
  assert.equal(getCourierModeDisplay(undefined), 'internal');
});
