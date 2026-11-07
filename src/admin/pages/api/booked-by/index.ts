import { Db } from 'mongodb';
import nextConnect from 'next-connect';
import { getErrorMessage, requireApiAuth } from '../../../helpers/api';
import { BOOKED_BY_COLLECTION, ensureBookedBySeeded } from '../../../helpers/bookedBy';
import middleware from '../../../helpers/database';

const handler = nextConnect();

handler.use(requireApiAuth);
handler.use(middleware);

handler.get(async (req: any, res: any) => {
  try {
    const db = req.db as Db;
    await ensureBookedBySeeded(db);

    const docs = await db
      .collection(BOOKED_BY_COLLECTION)
      .find()
      .sort({ name: 1 })
      .toArray();

    res.json({ bookedByUsers: docs, count: docs.length });
  } catch (err) {
    res.status(500).send({ bookedByUsers: [], count: 0, error: getErrorMessage(err) });
  }
});

export default handler;
