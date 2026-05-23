import assert from 'node:assert/strict';
import test from 'node:test';
import { getPaymentModeOptionClassName } from '../components/Forms/PaymentModeSelect';

test('renders Credit option with error text styling', () => {
  assert.equal(getPaymentModeOptionClassName('Credit'), 'text-status-danger');
});

test('keeps non-credit payment modes on the default text color', () => {
  assert.equal(getPaymentModeOptionClassName('Cash'), 'text-status-default');
});