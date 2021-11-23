import nextConnect from 'next-connect';
import middleware from '../../../helpers/database';

const handler = nextConnect();

handler.use(middleware);

handler.get(async (req: any, res: any) => {
    const limit = parseInt(req.query.limit, 10) || 50;
    const page = parseInt(req.query.page, 10)  || 1;
    const awb = req.query.awb;
    const ref = req.query.ref;

    let docs = [];
    let count = 0;

    if (awb) {
        docs = await req.db.collection('bookings').find({"awbNumber": awb})
            .sort( { _id: -1 }).skip((page - 1 || 0) * limit).limit(limit).toArray();
        count = await req.db.collection('bookings').find({"awbNumber": awb}).count();
    } else if (ref) {
        docs = await req.db.collection('bookings').find({"referenceNumber": ref})
            .sort( { _id: -1 }).skip((page - 1 || 0) * limit).limit(limit).toArray();
        count = await req.db.collection('bookings').find({"referenceNumber": ref}).count();
    } else {
        docs = await req.db.collection('bookings').find()
            .sort( { _id: -1 }).skip((page - 1 || 0) * limit).limit(limit).toArray();
            count = await req.db.collection('bookings').find().count();
    }

    res.json({booking: [...docs], count: count});
});

export default handler;