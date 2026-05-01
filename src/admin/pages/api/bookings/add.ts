import nextConnect from 'next-connect';
import { getErrorMessage, requireApiAuth } from '../../../helpers/api';
import { normalizeBookingPayload, ValidationError } from '../../../helpers/apiValidation';
import middleware from '../../../helpers/database';

const handler = nextConnect();

handler.use(requireApiAuth);
handler.use(middleware);

handler.post(async (req: any, res: any) => {
    try {
        const data = normalizeBookingPayload(req.body);
        let doc = await req.db.collection('bookings').insertOne(data);
        res.send(doc);
    }
    catch (err: any) {
        const statusCode = err instanceof ValidationError ? err.statusCode : 500;
        res.status(statusCode).send({ error: getErrorMessage(err) })
    }
});

export default handler;
