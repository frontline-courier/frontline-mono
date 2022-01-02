import { ObjectId } from 'bson';
import nextConnect from 'next-connect';
import middleware from '../../../helpers/database';

const handler = nextConnect();

handler.use(middleware);

handler.post(async (req: any, res: any) => {
    let data = req.body;
    let id = data._id;
    delete data._id;

    try {

        let doc = await req.db.collection('bookings').updateOne({
            _id: new ObjectId(id)
        },
            {
                $set: data,
            });

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