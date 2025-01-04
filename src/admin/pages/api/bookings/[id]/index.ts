import { ObjectId } from 'bson';
import nextConnect from 'next-connect';
import middleware from '../../../../helpers/database';

const handler = nextConnect();

handler.use(middleware);

handler.get(async (req: any, res: any) => {
    const { id } = req.query;

    try {
        const doc = await req.db.collection('bookings').findOne({ _id: new ObjectId(id) });
        res.json(doc);
    }
    catch (err: any) {
        res.status(500).send({ error: err?.message })
    }
    finally {
        req.dbClient.close();
    }
});

export default handler;
