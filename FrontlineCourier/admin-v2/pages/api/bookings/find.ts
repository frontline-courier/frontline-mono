import nextConnect from 'next-connect';
import middleware from '../../../helpers/database';

const handler = nextConnect();

handler.use(middleware);

handler.get(async (req: any, res: any) => {
    const { id, track } = req.query;
    let doc;

    if (track === '1') {
        doc = await req.db.collection('bookings').findOne({awbNumber: id});
    } else if (track === '2') {
        doc = await req.db.collection('bookings').findOne({referenceNumber: id});
    }

    res.json(doc);
    
});

export default handler;
