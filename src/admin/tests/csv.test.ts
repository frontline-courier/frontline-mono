import assert from 'node:assert/strict';
import test from 'node:test';
import { convertArrayOfObjectsToCSV } from '../helpers/csv';

test('returns an empty string for an empty array', () => {
  assert.equal(convertArrayOfObjectsToCSV([]), '');
});

test('returns an empty string when there are no columns', () => {
  assert.equal(convertArrayOfObjectsToCSV([{}], []), '');
});

test('converts rows to CSV with a header', () => {
  const csv = convertArrayOfObjectsToCSV([
    { awb: 'AWB1', courier: 'DHL' },
    { awb: 'AWB2', courier: 'UPS' },
  ]);

  assert.equal(csv, 'awb,courier\nAWB1,DHL\nAWB2,UPS');
});

test('uses an explicit column order when provided', () => {
  const csv = convertArrayOfObjectsToCSV(
    [{ awb: 'AWB1', courier: 'DHL' }],
    ['courier', 'awb'],
  );

  assert.equal(csv, 'courier,awb\nDHL,AWB1');
});

test('escapes commas, quotes, and newlines', () => {
  const csv = convertArrayOfObjectsToCSV([
    { name: 'Doe, John', note: 'Said "hello"', address: 'Line 1\nLine 2' },
  ]);

  assert.equal(
    csv,
    'name,note,address\n"Doe, John","Said ""hello""","Line 1\nLine 2"',
  );
});

test('renders null and undefined values as empty cells', () => {
  const csv = convertArrayOfObjectsToCSV([{ a: null, b: undefined, c: 0 }]);

  assert.equal(csv, 'a,b,c\n,,0');
});
