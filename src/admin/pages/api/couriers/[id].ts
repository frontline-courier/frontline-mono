import { Db, ObjectId } from 'mongodb';
import nextConnect from 'next-connect';
import { getErrorMessage, requireApiAuth } from '../../../helpers/api';
import { normalizeCourierPayload, parseObjectId, ValidationError } from '../../../helpers/apiValidation';
import middleware from '../../../helpers/database';
import { resetCache } from '../../../lib/cache';

const handler = nextConnect();

handler.use(requireApiAuth);
handler.use(middleware);

// Update a courier by ID
handler.put(async (req: any, res: any) => {
  try {
    const courierId = parseObjectId(req.query.id, 'Courier id');
    const { CourierId, Courier, Description, Track, Mode, Status } = normalizeCourierPayload(req.body);
    const collection = (req.db as Db).collection('couriers');
    await collection.updateOne(
      { _id: courierId }, 
      { $set: { 
        CourierId, 
        Courier, 
        Description, 
        Track, 
        Mode,
        Status 
      }} 
    );

    resetCache(); // Reset cache

    res.json({ status: 'success' });
  } catch (err) {
    const statusCode = err instanceof ValidationError ? err.statusCode : 500;
    res.status(statusCode).send({ status: 'error', error: getErrorMessage(err) });
  }
});

// Delete a courier by ID
handler.delete(async (req: any, res: any) => {
  try {
    const collection = (req.db as Db).collection('couriers');
    await collection.deleteOne({ _id: parseObjectId(req.query.id, 'Courier id') });

    resetCache(); // Reset cache
    
    res.json({ status: 'success' });
  } catch (err) {
    const statusCode = err instanceof ValidationError ? err.statusCode : 500;
    res.status(statusCode).send({ status: 'error', error: getErrorMessage(err) });
  }
});

export default handler;