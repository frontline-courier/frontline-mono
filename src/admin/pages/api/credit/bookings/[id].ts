import { Db, ObjectId } from 'mongodb';
import nextConnect from 'next-connect';
import { getErrorMessage, requireApiAuth } from '../../../../helpers/api';
import { normalizeCreditBookingPayload, parseObjectId, ValidationError } from '../../../../helpers/apiValidation';
import middleware from '../../../../helpers/database';

const handler = nextConnect();

handler.use(requireApiAuth);
handler.use(middleware);

// get one
handler.get(async (req: any, res: any) => {
    console.log('api called', req.query)
    try {
        res.json(await req.db.collection('credit_bookings').findOne({ _id: parseObjectId(req.query.id, 'Credit booking id') }));
    }
    catch (err: any) {
        const statusCode = err instanceof ValidationError ? err.statusCode : 500;
        res.status(statusCode).send({ error: getErrorMessage(err) })
    }
});

// update one
handler.patch(async (req: any, res: any) => {
    try {
        const { _id, ...payload } = req.body;
        const id = parseObjectId(typeof _id === 'string' ? _id : req.query.id, 'Credit booking id');
        const data = normalizeCreditBookingPayload(payload, true);

        let doc = await req.db.collection('credit_bookings').updateOne({
            _id: id
        },
            {
                $set: data,
            });

        res.json(doc);
    }
    catch (err: any) {
        const statusCode = err instanceof ValidationError ? err.statusCode : 500;
        res.status(statusCode).send({ error: getErrorMessage(err) })
    }
});

// delete one
handler.delete(async (req: any, res: any) => {

    try {

        let doc = await (req.db as Db).collection('credit_bookings').deleteOne({
            _id: parseObjectId(req.query.id, 'Credit booking id')
        });

        res.json(doc.acknowledged);
    }
    catch (err: any) {
        const statusCode = err instanceof ValidationError ? err.statusCode : 500;
        res.status(statusCode).send({ error: getErrorMessage(err) })
    }
});

export default handler;
