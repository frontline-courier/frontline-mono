import { ObjectId } from 'mongodb';
import nextConnect from 'next-connect';
import { getErrorMessage, requireApiAuth } from '../../../helpers/api';
import { buildBookingUpdatePayload } from '../../../helpers/bookingUpdatePayload';
import { ValidationError } from '../../../helpers/apiValidation';
import middleware from '../../../helpers/database';

const handler = nextConnect();

handler.use(requireApiAuth);
handler.use(middleware);

handler.post(async (req: any, res: any) => {
    try {
        const { _id, ...payload } = req.body;
        const id = typeof _id === 'string' ? _id : '';

        if (!ObjectId.isValid(id)) {
            throw new ValidationError('Booking id is invalid.');
        }

        const { $set, $unset } = buildBookingUpdatePayload(payload);

        const doc = await req.db.collection('bookings').updateOne(
            { _id: new ObjectId(id) },
            { $set, $unset },
        );

        res.json(doc);
    }
    catch (err: any) {
        const statusCode = err instanceof ValidationError ? err.statusCode : 500;
        res.status(statusCode).send({ error: getErrorMessage(err) });
    }
});

export default handler;
