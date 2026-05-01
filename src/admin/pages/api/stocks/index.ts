import { Db } from 'mongodb';
import nextConnect from 'next-connect';
import { getErrorMessage, requireApiAuth } from '../../../helpers/api';
import {
  normalizeStockEntriesPayload,
  normalizeStockOutPayload,
  ValidationError,
} from '../../../helpers/apiValidation';
import middleware from '../../../helpers/database';

const handler = nextConnect();

handler.use(requireApiAuth);
handler.use(middleware);

handler.post(async (req: any, res: any) => {
  try {
    const body = normalizeStockEntriesPayload(req.body);
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
    const statusCode = err instanceof ValidationError ? err.statusCode : 500;
    res.status(statusCode).send({ success: false, error: getErrorMessage(err) });
  }
});

handler.get(async (req: any, res: any) => {

  try {
    const collection = (req.db as Db).collection('stocks');

    const docs = await collection.find();

    const count = await collection.countDocuments();

    res.json({ stocks: [...await docs.toArray()], count: count });
  }
  catch (err) {
    res.status(500).send({ stocks: [], count: 0, error: getErrorMessage(err) });
  }
});

handler.put(async (req: any, res: any) => {
  try {
    const payload = normalizeStockOutPayload(req.body);
    const collection = (req.db as Db).collection('stocks');

    const docs = await collection.find({ awb: { $in: payload.awb }, courier: payload.courier, out: { $ne: true } });

    if ((await docs.toArray()).length !== payload.awb.length) {
      return res.send({ success: false, error: 'AWB not available in stock.' });
    }

    await collection.updateMany({ awb: { $in: payload.awb }, courier: payload.courier, out: { $ne: true } }, { $set: { out: true } });

    res.send({ success: true });
  }
  catch (err: any) {
    const statusCode = err instanceof ValidationError ? err.statusCode : 500;
    res.status(statusCode).send({ success: false, error: getErrorMessage(err) });
  }
});

export default handler;