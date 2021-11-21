import nextConnect from 'next-connect';
import middleware from '../../../helpers/database';

const handler = nextConnect();

handler.use(middleware);

handler.post(async (req: any, res: any) => {
    let data = JSON.parse(req.body);
    data.bookedDate = new Date(data.bookedDate);

    let doc = await req.db.collection('bookings').insertOne(data);
    res.json(doc);
});

export default handler;