import assert from 'node:assert/strict';
import test from 'node:test';
import {
  toDatetimeLocalString,
  toDateInputString,
  formatDisplayDatetimeShort,
  formatDisplayDate,
} from '../helpers/dateHelpers';

// Fixed UTC reference: 2026-05-23T04:30:00.000Z
// In UTC+5:30 (IST) this is 2026-05-23 10:00 local time
const UTC_ISO = '2026-05-23T04:30:00.000Z';

test('toDatetimeLocalString produces local YYYY-MM-DDTHH:mm (not UTC)', () => {
  const result = toDatetimeLocalString(UTC_ISO);

  // Must match datetime-local input format
  assert.match(result, /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}$/);

  // Round-tripping: converting back with new Date() and toISOString() must
  // reproduce the original UTC value
  const roundTripped = new Date(result).toISOString();
  assert.equal(roundTripped, UTC_ISO);
});

test('toDatetimeLocalString with no argument uses current time', () => {
  const result = toDatetimeLocalString();

  assert.match(result, /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}$/);

  // The result is minute-precision; compare truncated timestamps so a
  // sub-minute gap between Date.now() calls never causes a false failure
  const resultMinute = new Date(result).getTime();
  const nowMinute = Math.floor(Date.now() / 60000) * 60000;
  assert.ok(
    Math.abs(resultMinute - nowMinute) <= 60000,
    `result ${result} should be within one minute of now`,
  );
});

test('toDatetimeLocalString accepts a Date object', () => {
  const d = new Date(UTC_ISO);
  const result = toDatetimeLocalString(d);

  assert.match(result, /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}$/);
  assert.equal(new Date(result).toISOString(), UTC_ISO);
});

test('toDateInputString produces local YYYY-MM-DD', () => {
  const result = toDateInputString(UTC_ISO);

  assert.match(result, /^\d{4}-\d{2}-\d{2}$/);

  // The date part of the local string must match the local calendar date
  const expected = toDatetimeLocalString(UTC_ISO).slice(0, 10);
  assert.equal(result, expected);
});

test('toDateInputString with no argument uses today', () => {
  const result = toDateInputString();

  assert.match(result, /^\d{4}-\d{2}-\d{2}$/);
});

test('formatDisplayDatetimeShort formats as DD-MM-YYYY HH:mm', () => {
  const result = formatDisplayDatetimeShort(UTC_ISO);

  // Must be exactly DD-MM-YYYY HH:mm
  assert.match(result, /^\d{2}-\d{2}-\d{4} \d{2}:\d{2}$/);
});

test('formatDisplayDatetimeShort accepts a Date object', () => {
  const result = formatDisplayDatetimeShort(new Date(UTC_ISO));

  assert.match(result, /^\d{2}-\d{2}-\d{4} \d{2}:\d{2}$/);
});

test('formatDisplayDate formats as DD-MM-YYYY', () => {
  const result = formatDisplayDate(UTC_ISO);

  assert.match(result, /^\d{2}-\d{2}-\d{4}$/);
});

test('formatDisplayDate accepts a Date object', () => {
  const result = formatDisplayDate(new Date(UTC_ISO));

  assert.match(result, /^\d{2}-\d{2}-\d{4}$/);
});

test('formatDisplayDate and formatDisplayDatetimeShort share the same date portion', () => {
  const dateOnly = formatDisplayDate(UTC_ISO);
  const datetime = formatDisplayDatetimeShort(UTC_ISO);

  // The date part (DD-MM-YYYY) in both outputs must agree
  assert.equal(datetime.slice(0, 10), dateOnly);
});
