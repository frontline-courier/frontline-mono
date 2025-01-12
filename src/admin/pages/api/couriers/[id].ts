import { Db, ObjectId } from 'mongodb';
import nextConnect from 'next-connect';
import middleware from '../../../helpers/database';

const handler = nextConnect();

handler.use(middleware);

// Update a courier by ID
handler.put(async (req: any, res: any) => {
  const { id } = req.query;
  const { CourierId, Courier, Description, Track, Mode, Status } = req.body;

  try {
    const collection = (req.db as Db).collection('couriers');
    await collection.updateOne({ _id: new ObjectId(id) }, { $set: { CourierId, Courier, Description, Track, Mode, Status } });
    res.json({ status: 'success' });
  } catch (err) {
    res.send({ status: 'error', error: (err as Error).message });
  } finally {
    req.dbClient.close();
  }
});

// Delete a courier by ID
handler.delete(async (req: any, res: any) => {
  const { id } = req.query;

  try {
    const collection = (req.db as Db).collection('couriers');
    await collection.deleteOne({ _id: new ObjectId(id) });
    res.json({ status: 'success' });
  } catch (err) {
    res.send({ status: 'error', error: (err as Error).message });
  } finally {
    req.dbClient.close();
  }
});

export default handler;