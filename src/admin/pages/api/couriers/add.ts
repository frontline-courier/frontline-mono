import { Db } from 'mongodb';
import nextConnect from 'next-connect';
import { getErrorMessage, requireApiAuth } from '../../../helpers/api';
import { normalizeCourierPayload, ValidationError } from '../../../helpers/apiValidation';
import middleware from '../../../helpers/database';
import { resetCache } from '../../../lib/cache'; // Import cache functions

const handler = nextConnect();

handler.use(requireApiAuth);
handler.use(middleware);

handler.post(async (req: any, res: any) => {
  try {
    const { CourierId, Courier, Description, Track, Mode, Status } = normalizeCourierPayload(req.body);
    const collection = (req.db as Db).collection('couriers');
    await collection.insertOne({ CourierId, Courier, Description, Track, Mode, Status });

    resetCache(); // Reset cache

    res.json({ status: 'success' });
  } catch (err) {
    const statusCode = err instanceof ValidationError ? err.statusCode : 500;
    res.status(statusCode).json({ status: 'error', error: getErrorMessage(err) });
  }
});

export default handler;