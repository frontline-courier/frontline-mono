import { Db } from 'mongodb';
import nextConnect from 'next-connect';
import middleware from '../../../../helpers/database';

const handler = nextConnect();

handler.use(middleware);

handler.post(async (req: any, res: any) => {

  try {
    const collection = (req.db as Db).collection('stocks_coloader');

    await collection.insertOne({name: req.body.coloader});

    res.json({status: 'success'});
  }
  catch (err: any) {
    res.send({status: 'error', error: err.message});
  }
  finally {
    req.dbClient.close();
  }
});

export default handler;