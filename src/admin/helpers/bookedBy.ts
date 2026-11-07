import type { Db } from 'mongodb';
import { ValidationError } from './apiValidation';

export const BOOKED_BY_COLLECTION = 'booked_by';

const BOOKED_BY_META_COLLECTION = 'booked_by_meta';
const BOOKED_BY_SEED_ID = 'booked_by_seed';

/**
 * Legacy hardcoded values. They are inserted once when the collection is first
 * created so existing bookings keep a matching dropdown entry, after which the
 * list becomes fully database-driven.
 */
export const DEFAULT_BOOKED_BY_NAMES = ['Varalakshmi', 'Sathya', 'Kavitha', 'Varun'];

export async function ensureBookedBySeeded(db: Db) {
  const meta = db.collection(BOOKED_BY_META_COLLECTION);

  // Claim the one-time seed atomically so concurrent requests cannot both
  // insert the legacy defaults.
  const claim = await meta.updateOne(
    { _id: BOOKED_BY_SEED_ID } as any,
    { $setOnInsert: { seededAt: new Date() } },
    { upsert: true },
  );

  if (claim.upsertedCount === 0) {
    return;
  }

  try {
    const collection = db.collection(BOOKED_BY_COLLECTION);
    const count = await collection.countDocuments();

    if (count === 0) {
      await collection.insertMany(DEFAULT_BOOKED_BY_NAMES.map((name) => ({ name })));
    }
  } catch (error) {
    // Release the claim so the next request can retry.
    await meta.deleteOne({ _id: BOOKED_BY_SEED_ID } as any);
    throw error;
  }
}

export async function assertBookedByOptionExists(db: Db, name: string | undefined) {
  if (!name) {
    return;
  }

  const existing = await db.collection(BOOKED_BY_COLLECTION).findOne({ name });

  if (!existing) {
    throw new ValidationError('Booked By is invalid.');
  }
}
