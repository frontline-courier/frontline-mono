import { Db } from 'mongodb';
import nextConnect from 'next-connect';
import { getErrorMessage, requireApiAuth } from '../../../helpers/api';
import {
  escapeRegex,
  normalizeBookedByPayload,
  parseObjectId,
  ValidationError,
} from '../../../helpers/apiValidation';
import { BOOKED_BY_COLLECTION } from '../../../helpers/bookedBy';
import middleware from '../../../helpers/database';

const handler = nextConnect();

handler.use(requireApiAuth);
handler.use(middleware);

handler.put(async (req: any, res: any) => {
  try {
    const id = parseObjectId(req.query.id, 'Booked By id');
    const { name } = normalizeBookedByPayload(req.body);
    const collection = (req.db as Db).collection(BOOKED_BY_COLLECTION);

    const duplicate = await collection.findOne({
      _id: { $ne: id },
      name: { $regex: `^${escapeRegex(name!)}$`, $options: 'i' },
    });

    if (duplicate) {
      throw new ValidationError('A Booked By user with this name already exists.', 409);
    }

    const result = await collection.updateOne({ _id: id }, { $set: { name } });

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
    const result = await (req.db as Db)
      .collection(BOOKED_BY_COLLECTION)
      .deleteOne({ _id: id });

    if (result.deletedCount === 0) {
      throw new ValidationError('Booked By user not found.', 404);
    }

    res.json({ status: 'success' });
  } catch (err: any) {
    const statusCode = err instanceof ValidationError ? err.statusCode : 500;
    res.status(statusCode).send({ status: 'error', error: getErrorMessage(err) });
  }
});

export default handler;
