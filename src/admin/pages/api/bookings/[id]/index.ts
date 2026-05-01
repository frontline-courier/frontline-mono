import nextConnect from 'next-connect';
import { getErrorMessage, requireApiAuth } from '../../../../helpers/api';
import { parseObjectId, ValidationError } from '../../../../helpers/apiValidation';
import middleware from '../../../../helpers/database';

const handler = nextConnect();

handler.use(requireApiAuth);
handler.use(middleware);

handler.get(async (req: any, res: any) => {
    try {
        const doc = await req.db.collection('bookings').findOne({ _id: parseObjectId(req.query.id, 'Booking id') });
        res.json(doc);
    }
    catch (err: any) {
        const statusCode = err instanceof ValidationError ? err.statusCode : 500;
        res.status(statusCode).send({ error: getErrorMessage(err) })
    }
});

export default handler;
