import nextConnect from 'next-connect';
import middleware from '../../../helpers/database';

const handler = nextConnect();

handler.use(middleware);

handler.post(async (req: any, res: any) => {
    let data = req.body;
    data.bookedDate = new Date(data.bookedDate);

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