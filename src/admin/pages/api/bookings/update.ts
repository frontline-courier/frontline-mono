import { ObjectId } from 'mongodb';
import nextConnect from 'next-connect';
import { getErrorMessage, requireApiAuth } from '../../../helpers/api';
import { buildBookingUpdatePayload } from '../../../helpers/bookingUpdatePayload';
import { ValidationError } from '../../../helpers/apiValidation';
import { assertBookedByOptionExists } from '../../../helpers/bookedBy';
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

        // Only validate a changed bookedBy value. This keeps old bookings whose
        // value was later renamed/removed from the managed list editable.
        const bookedByValue = typeof payload.bookedBy === 'string' ? payload.bookedBy.trim() : '';
        if (bookedByValue) {
            const existingBooking = await req.db
                .collection('bookings')
                .findOne({ _id: new ObjectId(id) }, { projection: { bookedBy: 1 } });

            if (bookedByValue !== existingBooking?.bookedBy) {
                await assertBookedByOptionExists(req.db, bookedByValue);
            }
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
