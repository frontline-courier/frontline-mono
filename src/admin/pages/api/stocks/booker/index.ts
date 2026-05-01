import { Db } from 'mongodb';
import nextConnect from 'next-connect';
import { getErrorMessage, requireApiAuth } from '../../../../helpers/api';
import middleware from '../../../../helpers/database';

const handler = nextConnect();

handler.use(requireApiAuth);
handler.use(middleware);

handler.get(async (req: any, res: any) => {

  try {
    const collection = (req.db as Db).collection('stocks_booker');

    const docs = await collection.find();

    const count = await collection.countDocuments();

    res.json({ bookers: [...await docs.toArray()], count: count });
  }
  catch (err) {
    res.status(500).send({ bookers: [], count: 0, error: getErrorMessage(err) });
  }
});

export default handler;