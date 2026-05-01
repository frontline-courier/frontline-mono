import nextConnect from 'next-connect';
import middleware from '../../../helpers/database';
import { bookedByOptions } from '../../../constants/bookedByOptions';
import { paymentModes } from '../../../constants/paymentModes';

const handler = nextConnect();
const bookedByOptionsSet = new Set(bookedByOptions);
const paymentModesSet = new Set(paymentModes);

handler.use(middleware);

handler.post(async (req: any, res: any) => {
    let data = req.body;
    data.bookedDate = new Date(data.bookedDate);
    data.bookedBy = bookedByOptionsSet.has(data.bookedBy as typeof bookedByOptions[number]) ? data.bookedBy : '';
    data.paymentMode = paymentModesSet.has(data.paymentMode as typeof paymentModes[number]) ? data.paymentMode : '';

    try {
        let doc = await req.db.collection('bookings').insertOne(data);
        res.send(doc);
    }
    catch (err: any) {
        res.status(500).send({ error: err?.message })
    }
    finally {
        req.dbClient.close();
      }
});

export default handler;
