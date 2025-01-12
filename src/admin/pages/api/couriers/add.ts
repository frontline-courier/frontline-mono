import { Db } from 'mongodb';
import nextConnect from 'next-connect';
import middleware from '../../../helpers/database';
import { resetCache } from '../../../lib/cache'; // Import cache functions

const handler = nextConnect();

handler.use(middleware);

handler.post(async (req: any, res: any) => {
  const { CourierId, Courier, Description, Track, Mode, Status } = req.body;

  // Validate request body
  if (!CourierId || !Courier) {
    return res.status(400).json({ status: 'error', error: 'CourierId and Courier are required.' });
  }

  try {
    const collection = (req.db as Db).collection('couriers');
    await collection.insertOne({ CourierId, Courier, Description, Track, Mode, Status });

    resetCache(); // Reset cache

    res.json({ status: 'success' });
  } catch (err) {
    console.error('Error inserting courier:', err);
    res.status(500).json({ status: 'error', error: (err as Error).message });
  } finally {
    req.dbClient.close();
  }
});

export default handler;