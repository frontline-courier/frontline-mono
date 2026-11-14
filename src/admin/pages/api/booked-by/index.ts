import { Db } from 'mongodb';
import nextConnect from 'next-connect';
import { getErrorMessage, requireApiAuth } from '../../../helpers/api';
import {
  BOOKED_BY_COLLECTION,
  ensureBookedBySeeded,
  isBookedByActive,
} from '../../../helpers/bookedBy';
import middleware from '../../../helpers/database';

const handler = nextConnect();

handler.use(requireApiAuth);
handler.use(middleware);

handler.get(async (req: any, res: any) => {
  try {
    const db = req.db as Db;
    await ensureBookedBySeeded(db);

    const includeInactive =
      req.query.includeInactive === 'true' || req.query.includeInactive === '1';
    const filter = includeInactive ? {} : { isActive: { $ne: false } };

    const docs = await db
      .collection(BOOKED_BY_COLLECTION)
      .find(filter)
      .sort({ name: 1 })
      .toArray();

    const bookedByUsers = docs.map((doc) => ({
      ...doc,
      isActive: isBookedByActive(doc as any),
    }));

    res.json({ bookedByUsers, count: bookedByUsers.length });
  } catch (err) {
    res.status(500).send({ bookedByUsers: [], count: 0, error: getErrorMessage(err) });
  }
});

export default handler;
