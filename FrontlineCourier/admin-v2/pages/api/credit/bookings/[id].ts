import { Db, ObjectId } from 'mongodb';
import nextConnect from 'next-connect';
import middleware from '../../../../helpers/database';

const handler = nextConnect();

handler.use(middleware);

// get one
handler.get(async (req: any, res: any) => {
    console.log('api called', req.query)
    const { id } = req.query;

    try {
        res.json(await req.db.collection('credit_bookings').findOne({ _id: new ObjectId(id) }));
    }
    catch (err: any) {
        res.status(500).send({ error: err?.message })
    }
    finally {
        req.dbClient.close();
    }
});

// update one
handler.patch(async (req: any, res: any) => {
    let data = req.body;
    let id = data._id;
    delete data._id;
    data.bookedDate = data.bookedDate ? new Date(data.bookedDate) : undefined;

    try {

        let doc = await req.db.collection('credit_bookings').updateOne({
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

// delete one
handler.delete(async (req: any, res: any) => {

    try {

        let doc = await (req.db as Db).collection('credit_bookings').deleteOne({
            _id: new ObjectId(req.query.id)
        });

        res.json(doc.acknowledged);
    }
    catch (err: any) {
        res.status(500).send({ error: err?.message })
    }
    finally {
        req.dbClient.close();
    }
});

export default handler;
