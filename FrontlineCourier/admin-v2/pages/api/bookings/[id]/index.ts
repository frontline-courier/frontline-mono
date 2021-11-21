import { ObjectId } from 'bson';
import nextConnect from 'next-connect';
import middleware from '../../../../helpers/database';

const handler = nextConnect();

handler.use(middleware);

handler.get(async (req: any, res: any) => {
    const { id } = req.query;

    const doc = await req.db.collection('bookings').findOne({_id: new ObjectId(id)});
    res.json(doc);
});

export default handler;
