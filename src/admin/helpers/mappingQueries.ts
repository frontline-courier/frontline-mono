export function buildVolumetricMappingUniquenessQuery(
  courierId: unknown,
  transportMode: unknown,
  excludeId?: unknown,
) {
  const query: Record<string, unknown> = {
    courierId: Number(courierId),
    transportMode: Number(transportMode),
  };

  if (excludeId !== undefined && excludeId !== null) {
    query._id = { $ne: excludeId };
  }

  return query;
}
