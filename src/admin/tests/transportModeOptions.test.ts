import assert from 'node:assert/strict';
import test from 'node:test';
import {
  getTransportModeOptionLabel,
  transportModeOptions,
} from '../constants/transportModeOptions';

test('transport mode options use numeric values', () => {
  for (const option of transportModeOptions) {
    assert.equal(typeof option.value, 'number');
  }
});

test('maps every numeric transport mode to its label', () => {
  const labels = new Map(transportModeOptions.map((option) => [option.value, option.label]));

  for (const [value, label] of labels) {
    assert.equal(getTransportModeOptionLabel(value), label);
    assert.equal(getTransportModeOptionLabel(String(value)), label);
  }
});

test('falls back to NA for unknown values', () => {
  assert.equal(getTransportModeOptionLabel(0), 'NA');
  assert.equal(getTransportModeOptionLabel(999), 'NA');
  assert.equal(getTransportModeOptionLabel('Air'), 'NA');
  assert.equal(getTransportModeOptionLabel(null), 'NA');
  assert.equal(getTransportModeOptionLabel(undefined), 'NA');
});
