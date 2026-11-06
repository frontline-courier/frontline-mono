import assert from 'node:assert/strict';
import test from 'node:test';
import {
  calculateCarrierInsurance,
  calculateCreditTotal,
  calculateFovRisk,
} from '../helpers/calculations/creditCalculation';

test('calculates carrier insurance at 2.5%', () => {
  assert.equal(calculateCarrierInsurance(1000), 25);
  assert.equal(calculateCarrierInsurance(999), 24.98);
});

test('calculates FOV risk at 0.25%', () => {
  assert.equal(calculateFovRisk(1000), 2.5);
  assert.equal(calculateFovRisk(999), 2.5);
});

test('total includes amount, ODA/EDL, insurance, and FOV risk', () => {
  assert.equal(
    calculateCreditTotal({
      amount: 1000,
      odaEdl: 100,
      carrierInsurance: 25,
      fovRisk: 2.5,
    }),
    1127.5,
  );
});

test('total excludes ODA/EDL when it is zero', () => {
  assert.equal(
    calculateCreditTotal({ amount: 1000, odaEdl: 0, carrierInsurance: 25, fovRisk: 2.5 }),
    1027.5,
  );
});

test('treats missing and non-numeric values as zero', () => {
  assert.equal(calculateCreditTotal({ amount: 'not-a-number', odaEdl: null }), 0);
  assert.equal(calculateCreditTotal({}), 0);
});

test('rounds to two decimal places', () => {
  assert.equal(
    calculateCreditTotal({ amount: 0.1, odaEdl: 0.2 }),
    0.3,
  );
});
