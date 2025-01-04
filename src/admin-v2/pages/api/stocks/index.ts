import { Db } from 'mongodb';
import nextConnect from 'next-connect';
import middleware from '../../../helpers/database';

const handler = nextConnect();

handler.use(middleware);

handler.post(async (req: any, res: any) => {
  try {
    const body = req.body;
    const collection = (req.db as Db).collection('stocks');
 
    const docs = await collection.find({ awb: { $in: body.map((v: any) => v.awb) }, courier: body[0].courier });

    const docLength = (await docs.toArray()).length;

    if (docLength > 0) {
      return res.send({ success: false, error: 'AWB already available in stock!' });
    }

    await collection.insertMany(req.body);

    res.send({ success: true });
  }
  catch (err: any) {
    res.send({ success: false, error: err.message });
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

handler.put(async (req: any, res: any) => {
  try {
    const collection = (req.db as Db).collection('stocks');

    const docs = await collection.find({ awb: { $in: req.body.awb }, courier: req.body.courier, out: { $ne: true } });

    if ((await docs.toArray()).length !== req.body.awb.length) {
      return res.send({ success: false, error: 'AWB not available in stock.' });
    }

    await collection.updateMany({ awb: { $in: req.body.awb }, courier: req.body.courier, out: { $ne: true } }, { $set: { out: true } });

    res.send({ success: true });
  }
  catch (err: any) {
    res.send({ success: false, error: err.message });
  }
  finally {
    req.dbClient.close();
  }
});

export default handler;