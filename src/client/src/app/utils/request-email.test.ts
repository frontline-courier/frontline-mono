import assert from 'node:assert/strict';
import test from 'node:test';
import {
  REQUEST_EMAIL_RECIPIENTS,
  buildPickupEmails,
  buildQuoteEmails,
  escapeHtml,
} from './request-email';

const quoteForm = () => ({
  contactName: 'Jane Doe',
  companyName: 'Acme',
  email: 'jane@example.com',
  mobile: '9999999999',
  fromLocation: 'Chennai',
  toLocation: 'Delhi',
  shipmentCount: 2,
  totalWeight: 10,
  volumeL: 10,
  volumeB: 20,
  volumeH: 30,
  contentType: 'Documents',
  contentWorth: 5000,
  contentMode: 'Commercial',
  remarks: 'Fragile',
});

const pickupForm = () => ({
  name: 'John Doe',
  email: 'john@example.com',
  phone: '8888888888',
  address: 'Chennai',
  shipmentType: 'Dox',
  shipmentQty: 1,
  shipmentWeight: 2,
  deliveryAddress: 'Mumbai',
});

test('escapeHtml neutralises HTML characters', () => {
  assert.equal(
    escapeHtml('<script>alert("x")</script> & more'),
    '&lt;script&gt;alert(&quot;x&quot;)&lt;/script&gt; &amp; more'
  );
});

test('quote emails go to the ops recipients and reply to the requester', () => {
  const { team, customer } = buildQuoteEmails(quoteForm());

  assert.deepEqual(team.to, REQUEST_EMAIL_RECIPIENTS);
  assert.equal(team.replyTo, 'jane@example.com');
  assert.match(team.subject, /Quote Request/);
  assert.match(team.subject, /Jane Doe/);
  assert.equal(customer?.to, 'jane@example.com');
});

test('quote team email contains every submitted field', () => {
  const { team } = buildQuoteEmails(quoteForm());

  for (const value of ['Jane Doe', 'Acme', 'Chennai', 'Delhi', 'Documents', 'Fragile']) {
    assert.match(team.html, new RegExp(value));
  }
});

test('quote email omits the customer copy when no email was provided', () => {
  const { customer } = buildQuoteEmails({ ...quoteForm(), email: '' });

  assert.equal(customer, null);
});

test('quote email escapes user input in the HTML body', () => {
  const { team } = buildQuoteEmails({
    ...quoteForm(),
    contactName: '<img src=x onerror=alert(1)>',
  });

  assert.ok(!team.html.includes('<img src=x'));
  assert.match(team.html, /&lt;img src=x/);
});

test('pickup emails go to the ops recipients and include the request details', () => {
  const { team, customer } = buildPickupEmails(pickupForm());

  assert.deepEqual(team.to, REQUEST_EMAIL_RECIPIENTS);
  assert.match(team.subject, /Pickup Request/);
  assert.match(team.subject, /John Doe/);
  assert.match(team.html, /Mumbai/);
  assert.equal(customer?.to, 'john@example.com');
});

test('pickup email omits the customer copy when no email was provided', () => {
  const { customer } = buildPickupEmails({ ...pickupForm(), email: undefined });

  assert.equal(customer, null);
});
