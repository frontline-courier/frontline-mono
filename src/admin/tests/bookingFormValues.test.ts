import assert from 'node:assert/strict';
import test from 'node:test';
import { buildBookingFormValues, buildCloneFormValues, getNumericFieldValue } from '../helpers/bookingFormValues';
import { BookingFormInputs } from '../interfaces/bookingForm';

const defaultValues: Partial<BookingFormInputs> = {
  courier: 0,
  doxType: 0,
  shipmentMode: 0,
  transportMode: 0,
  importDuty: '',
  bookedBy: '',
  paymentMode: '',
  creditStatus: '',
  creditNotes: '',
  branch: '',
  bookingAmount: undefined,
  dueAmount: undefined,
  actualWeight: undefined,
  bookedDate: '2000-01-01T00:00',
  insured: false,
};

const baseBooking = () => ({
  _id: '507f1f77bcf86cd799439011',
  awbNumber: 'AWB12345',
  referenceNumber: 'REF-1',
  thirdPartyNumber: 'TP-9',
  bookedDate: '2026-05-23T04:30:00.000Z',
  courier: 12,
  shipperName: 'Shipper Co',
  receiverName: 'Receiver Co',
  origin: 'Chennai',
  destination: 'Mumbai',
  shipmentMode: 1,
  doxType: 1,
  transportMode: 1,
  actualWeight: '4.5',
  bookingAmount: '1200',
  insured: true,
  shipmentStatus: 'Delivered',
  delivery: [{ statusId: 'Delivered' }],
});

test('getNumericFieldValue converts numeric strings and rejects invalid values', () => {
  assert.equal(getNumericFieldValue('4.5'), 4.5);
  assert.equal(getNumericFieldValue(7), 7);
  assert.equal(getNumericFieldValue(''), undefined);
  assert.equal(getNumericFieldValue(null), undefined);
  assert.equal(getNumericFieldValue('abc'), undefined);
});

test('buildBookingFormValues keeps the AWB and loads the booking fields for edit', () => {
  const values = buildBookingFormValues(baseBooking(), defaultValues);

  assert.equal(values.awbNumber, 'AWB12345');
  assert.equal(values.referenceNumber, 'REF-1');
  assert.equal(values.shipperName, 'Shipper Co');
  assert.equal(values.receiverName, 'Receiver Co');
  assert.equal(values.bookingAmount, 1200);
  assert.equal(values.actualWeight, 4.5);
  assert.equal(values.insured, true);
  assert.match(String(values.bookedDate), /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}$/);
  assert.equal(new Date(String(values.bookedDate)).toISOString(), '2026-05-23T04:30:00.000Z');
});

test('buildCloneFormValues clears the AWB but copies the reusable booking fields', () => {
  const values = buildCloneFormValues(baseBooking(), defaultValues);

  assert.equal(values.awbNumber, '');
  assert.equal(values.referenceNumber, 'REF-1');
  assert.equal(values.thirdPartyNumber, 'TP-9');
  assert.equal(values.shipperName, 'Shipper Co');
  assert.equal(values.receiverName, 'Receiver Co');
  assert.equal(values.origin, 'Chennai');
  assert.equal(values.destination, 'Mumbai');
  assert.equal(values.courier, 12);
  assert.equal(values.bookingAmount, 1200);
  assert.equal(values.insured, true);
});

test('buildCloneFormValues resets the booking date to the current local time', () => {
  const values = buildCloneFormValues(baseBooking(), defaultValues);

  assert.match(String(values.bookedDate), /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}$/);
  const clonedDate = new Date(String(values.bookedDate)).getTime();
  const nowMinute = Math.floor(Date.now() / 60000) * 60000;

  assert.ok(Math.abs(clonedDate - nowMinute) <= 60000, 'clone should use the current date');
});

test('buildCloneFormValues does not mutate the source booking', () => {
  const booking = baseBooking();
  buildCloneFormValues(booking, defaultValues);

  assert.equal(booking.awbNumber, 'AWB12345');
});
