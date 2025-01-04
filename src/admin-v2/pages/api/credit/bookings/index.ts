import { Db } from 'mongodb';
import nextConnect from 'next-connect';
import middleware from '../../../../helpers/database';

const handler = nextConnect();

handler.use(middleware);

// create
handler.post(async (req: any, res: any) => {
    let data = req.body;
    data.bookedDate = new Date(data.bookedDate);

    try {
        let doc = await req.db.collection('credit_bookings').insertOne(data);
        res.send(doc);
    }
    catch (err: any) {
        res.status(500).send({ error: err?.message })
    }
    finally {
        req.dbClient.close();
      }
});

// read all
handler.get(async (req: any, res: any) => {
    const limit = parseInt(req.query.limit, 10) || 25;
    const page = parseInt(req.query.page, 10)  || 1;
    const { pod, client, courier, mode, service } = req.query

    let docs = [];
    let count = 0;
    let query: any = {};

    if (pod) {
        query.pod = pod;
    }
    if (client) {
        query.client = client;
    }
    if (courier) {
        query.courier = courier;
    }
    if (mode) {
        query.mode = mode;
    }
    if (service) {
        query.service = service;
    }

    try {
        const collection = (req.db as Db).collection('credit_bookings');

        docs = await collection.find(query)
            .sort( { _id: -1 }).skip((page - 1 || 0) * limit).limit(limit).toArray();

        count = await collection.find(query).count();
    
        res.json({booking: [...docs], count: count});
    }
    catch (err) {
        res.send({booking: [], count: 0});
    }
    finally {
        req.dbClient.close();
      }
});

export default handler;