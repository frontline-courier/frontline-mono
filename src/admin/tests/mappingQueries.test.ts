import assert from 'node:assert/strict';
import test from 'node:test';
import { buildVolumetricMappingUniquenessQuery } from '../helpers/mappingQueries';

test('uniqueness query uses numeric courier and transport mode', () => {
  assert.deepEqual(
    buildVolumetricMappingUniquenessQuery('7', '6'),
    { courierId: 7, transportMode: 6 },
  );
});

test('same courier can have different transport-mode mappings', () => {
  const air = buildVolumetricMappingUniquenessQuery(7, 1);
  const surface = buildVolumetricMappingUniquenessQuery(7, 6);

  assert.notDeepEqual(air, surface);
});

test('update query excludes the current document', () => {
  const excludeId = { toString: () => 'mapping-id' };

  assert.deepEqual(
    buildVolumetricMappingUniquenessQuery(7, 6, excludeId),
    { courierId: 7, transportMode: 6, _id: { $ne: excludeId } },
  );
});

test('create query omits the exclusion clause', () => {
  const query = buildVolumetricMappingUniquenessQuery(7, 6) as Record<string, unknown>;

  assert.ok(!('_id' in query));
});
