import assert from 'node:assert/strict';
import test from 'node:test';
import {
  calculateInsuranceAmount,
  getInsuranceRate,
} from '../helpers/calculations/bookingRateCalculation';

test('new products use the 2.5% insurance rate', () => {
  assert.equal(getInsuranceRate(false), 0.025);
});

test('used products use the 3% insurance rate', () => {
  assert.equal(getInsuranceRate(true), 0.03);
});

test('insurance amount is rounded to two decimals', () => {
  assert.equal(calculateInsuranceAmount(1000, false), 25);
  assert.equal(calculateInsuranceAmount(1000, true), 30);
  assert.equal(calculateInsuranceAmount(999, false), 24.98);
});

test('missing, invalid, or non-positive goods values produce zero insurance', () => {
  assert.equal(calculateInsuranceAmount(undefined, false), 0);
  assert.equal(calculateInsuranceAmount('nope', true), 0);
  assert.equal(calculateInsuranceAmount(0, false), 0);
  assert.equal(calculateInsuranceAmount(-100, false), 0);
});
