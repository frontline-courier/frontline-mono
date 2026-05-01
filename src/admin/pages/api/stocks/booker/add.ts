import { Db } from 'mongodb';
import nextConnect from 'next-connect';
import { getErrorMessage, requireApiAuth } from '../../../../helpers/api';
import { normalizeBookerPayload, ValidationError } from '../../../../helpers/apiValidation';
import middleware from '../../../../helpers/database';

const handler = nextConnect();

handler.use(requireApiAuth);
handler.use(middleware);

handler.post(async (req: any, res: any) => {

  try {
    const collection = (req.db as Db).collection('stocks_booker');

    await collection.insertOne(normalizeBookerPayload(req.body));

    res.json({status: 'success'});
  }
  catch (err: any) {
    const statusCode = err instanceof ValidationError ? err.statusCode : 500;
    res.status(statusCode).send({status: 'error', error: getErrorMessage(err)});
  }
});

export default handler;