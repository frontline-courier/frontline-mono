import { Db } from 'mongodb';
import nextConnect from 'next-connect';
import middleware from '../../../../helpers/database';

const handler = nextConnect();

handler.use(middleware);

handler.get(async (req: any, res: any) => {

  try {
    const collection = (req.db as Db).collection('stocks_booker');

    const docs = await collection.find();

    const count = await docs.count();

    res.json({ bookers: [...await docs.toArray()], count: count });
  }
  catch (err) {
    res.send({ bookers: [], count: 0 });
  }
  finally {
    req.dbClient.close();
  }
});

export default handler;