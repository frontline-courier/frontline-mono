import { Db } from 'mongodb';
import nextConnect from 'next-connect';
import { getErrorMessage, requireApiAuth } from '../../../helpers/api';
import {
  escapeRegex,
  normalizeBookedByUpdatePayload,
  parseObjectId,
  ValidationError,
} from '../../../helpers/apiValidation';
import { BOOKED_BY_COLLECTION, countBookedByReferences } from '../../../helpers/bookedBy';
import middleware from '../../../helpers/database';

const handler = nextConnect();

handler.use(requireApiAuth);
handler.use(middleware);

handler.put(async (req: any, res: any) => {
  try {
    const id = parseObjectId(req.query.id, 'Booked By id');
    const payload = normalizeBookedByUpdatePayload(req.body);
    const collection = (req.db as Db).collection(BOOKED_BY_COLLECTION);

    if (typeof payload.name === 'string') {
      const duplicate = await collection.findOne({
        _id: { $ne: id },
        name: { $regex: `^${escapeRegex(payload.name)}$`, $options: 'i' },
      });

      if (duplicate) {
        throw new ValidationError('A Booked By user with this name already exists.', 409);
      }
    }

    const result = await collection.updateOne({ _id: id }, { $set: payload });

    if (result.matchedCount === 0) {
      throw new ValidationError('Booked By user not found.', 404);
    }

    res.json({ status: 'success' });
  } catch (err: any) {
    const statusCode = err instanceof ValidationError ? err.statusCode : 500;
    res.status(statusCode).send({ status: 'error', error: getErrorMessage(err) });
  }
});

handler.delete(async (req: any, res: any) => {
  try {
    const id = parseObjectId(req.query.id, 'Booked By id');
    const db = req.db as Db;
    const collection = db.collection(BOOKED_BY_COLLECTION);
    const user = await collection.findOne({ _id: id });

    if (!user) {
      throw new ValidationError('Booked By user not found.', 404);
    }

    const referenceCount = await countBookedByReferences(db, user.name);

    if (referenceCount > 0) {
      throw new ValidationError(
        `"${user.name}" is used by ${referenceCount} booking${referenceCount === 1 ? '' : 's'}. Mark this user inactive instead of deleting.`,
        409,
      );
    }

    await collection.deleteOne({ _id: id });

    res.json({ status: 'success' });
  } catch (err: any) {
    const statusCode = err instanceof ValidationError ? err.statusCode : 500;
    res.status(statusCode).send({ status: 'error', error: getErrorMessage(err) });
  }
});

export default handler;
