import assert from 'node:assert/strict';
import test from 'node:test';
import { buildStockDuplicateQuery } from '../helpers/stockQueries';

test('checks every AWB/courier pair instead of only the first courier', () => {
  const query = buildStockDuplicateQuery([
    { awb: 'AWB1', courier: 'DHL' },
    { awb: 'AWB2', courier: 'UPS' },
  ]);

  assert.deepEqual(query, {
    $or: [
      { awb: 'AWB1', courier: 'DHL' },
      { awb: 'AWB2', courier: 'UPS' },
    ],
  });
});

test('preserves duplicate pairs when the same AWB appears twice', () => {
  const query = buildStockDuplicateQuery([
    { awb: 'AWB1', courier: 'DHL' },
    { awb: 'AWB1', courier: 'DHL' },
  ]);

  assert.equal(query.$or.length, 2);
});
