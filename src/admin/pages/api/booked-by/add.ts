import { Db } from 'mongodb';
import nextConnect from 'next-connect';
import { getErrorMessage, requireApiAuth } from '../../../helpers/api';
import {
  escapeRegex,
  normalizeBookedByPayload,
  ValidationError,
} from '../../../helpers/apiValidation';
import { BOOKED_BY_COLLECTION } from '../../../helpers/bookedBy';
import middleware from '../../../helpers/database';

const handler = nextConnect();

handler.use(requireApiAuth);
handler.use(middleware);

handler.post(async (req: any, res: any) => {
  try {
    const { name } = normalizeBookedByPayload(req.body);
    const collection = (req.db as Db).collection(BOOKED_BY_COLLECTION);

    const duplicate = await collection.findOne({
      name: { $regex: `^${escapeRegex(name!)}$`, $options: 'i' },
    });

    if (duplicate) {
      throw new ValidationError('A Booked By user with this name already exists.', 409);
    }

    await collection.insertOne({ name, isActive: true });

    res.json({ status: 'success' });
  } catch (err: any) {
    const statusCode = err instanceof ValidationError ? err.statusCode : 500;
    res.status(statusCode).send({ status: 'error', error: getErrorMessage(err) });
  }
});

export default handler;
