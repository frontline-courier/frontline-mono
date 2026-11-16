import assert from 'node:assert/strict';
import test from 'node:test';

import {
  getShipmentStatus,
  isSameShipmentStatus,
  normalizeShipmentStatusValue,
} from './courier-status.ts';

test('normalizes legacy shipment status text to the canonical shared value', () => {
  assert.equal(normalizeShipmentStatusValue('Reached destinatation'), 'Reached Destination');
  assert.equal(normalizeShipmentStatusValue('Returned  to Orgin'), 'Returned to Origin');
  assert.equal(normalizeShipmentStatusValue('waiting for clearance'), 'Waiting for Clearance');
  assert.equal(normalizeShipmentStatusValue('LOAD ARRIVED  LATE'), 'Load Arrived Late');
  assert.equal(normalizeShipmentStatusValue('Clearance process Ok'), 'Custom Clearance Completed at Destination');
  assert.equal(normalizeShipmentStatusValue('FDA Under processs'), 'FDA Under Process');
  assert.equal(normalizeShipmentStatusValue('Under FDA Clearence'), 'Under FDA Clearance');
  assert.equal(normalizeShipmentStatusValue('Shilpment hold for packing'), 'Shipment Hold for Packing');
});

test('resolves shipment status ids and preserves canonical display text', () => {
  assert.equal(getShipmentStatus(15), 'Taken for Delivery');
  assert.equal(getShipmentStatus(50), 'RTO delivered - Shipper');
  assert.equal(getShipmentStatus(25), 'Custom Clearance Completed at Destination');
  assert.equal(getShipmentStatus(58), 'FDA Under Process');
  assert.equal(getShipmentStatus(63), 'Shipment Hold for ID Proof');
});

test('treats legacy and canonical shipment status text as the same status', () => {
  assert.equal(isSameShipmentStatus('RTO delivered  Shipper', 'RTO delivered - Shipper'), true);
  assert.equal(isSameShipmentStatus('Wrong phone  / Not reach', 'Wrong Phone Number or Not Reachable'), true);
  assert.equal(isSameShipmentStatus('Booked', 'Delivered'), false);
});

test('returns undefined for invalid shipment status text', () => {
  assert.equal(normalizeShipmentStatusValue('not-a-real-status'), undefined);
});