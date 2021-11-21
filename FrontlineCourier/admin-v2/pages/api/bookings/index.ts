import nextConnect from 'next-connect';
import middleware from '../../../helpers/database';

const handler = nextConnect();

handler.use(middleware);

handler.get(async (req: any, res: any) => {
    const limit = parseInt(req.query.limit || 50, 10);
    const page = parseInt(req.query.page || 0, 10);

    let doc = await req.db.collection('bookings').find().sort( { _id: -1 }).skip((page - 1 || 0) * limit).limit(limit).toArray();
    let count = await req.db.collection('bookings').find().count();
    res.json({booking: [...doc], count: count});
});

export default handler;