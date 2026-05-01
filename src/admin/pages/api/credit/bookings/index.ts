import { Db } from 'mongodb';
import nextConnect from 'next-connect';
import { getErrorMessage, requireApiAuth } from '../../../../helpers/api';
import { normalizeCreditBookingPayload, ValidationError } from '../../../../helpers/apiValidation';
import middleware from '../../../../helpers/database';

const handler = nextConnect();

handler.use(requireApiAuth);
handler.use(middleware);

// create
handler.post(async (req: any, res: any) => {
    try {
        const data = normalizeCreditBookingPayload(req.body);
        let doc = await req.db.collection('credit_bookings').insertOne(data);
        res.send(doc);
    }
    catch (err: any) {
        const statusCode = err instanceof ValidationError ? err.statusCode : 500;
        res.status(statusCode).send({ error: getErrorMessage(err) })
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

        count = await collection.countDocuments(query);
    
        res.json({booking: [...docs], count: count});
    }
    catch (err) {
        res.status(500).send({ booking: [], count: 0, error: getErrorMessage(err) });
    }
});

export default handler;