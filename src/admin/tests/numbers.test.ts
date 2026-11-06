import assert from 'node:assert/strict';
import test from 'node:test';
import { isNumericInput } from '../helpers/numbers';

test('accepts finite numeric values and numeric strings', () => {
  assert.equal(isNumericInput(0), true);
  assert.equal(isNumericInput(7), true);
  assert.equal(isNumericInput('6'), true);
  assert.equal(isNumericInput('0'), true);
  assert.equal(isNumericInput(-1.5), true);
});

test('rejects blank, null, undefined, and non-numeric values', () => {
  assert.equal(isNumericInput(''), false);
  assert.equal(isNumericInput('   '), false);
  assert.equal(isNumericInput(null), false);
  assert.equal(isNumericInput(undefined), false);
  assert.equal(isNumericInput('Air'), false);
  assert.equal(isNumericInput(Number.NaN), false);
  assert.equal(isNumericInput(Number.POSITIVE_INFINITY), false);
});
