import { Db } from 'mongodb';
import nextConnect from 'next-connect';
import middleware from '../../../helpers/database';

const handler = nextConnect();

handler.use(middleware);

handler.post(async (req: any, res: any) => {
  try {
    const collection = (req.db as Db).collection('stocks');

    const docs = await collection.insertMany(req.body);

    res.send({ 'success': true });
  }
  catch (err) {
    res.send({ 'success': false });
  }
  finally {
    req.dbClient.close();
  }
});

handler.get(async (req: any, res: any) => {

  try {
    const collection = (req.db as Db).collection('stocks');

    const docs = await collection.find();

    const count = await docs.count();

    res.json({ stocks: [...await docs.toArray()], count: count });
  }
  catch (err) {
    res.send({ stocks: [], count: 0 });
  }
  finally {
    req.dbClient.close();
  }
});

export default handler;