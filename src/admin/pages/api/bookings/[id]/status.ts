import { ObjectId } from 'mongodb';
import nextConnect from 'next-connect';
import { getErrorMessage, requireApiAuth } from '../../../../helpers/api';
import { normalizeBookingStatusPayload, ValidationError } from '../../../../helpers/apiValidation';
import middleware from '../../../../helpers/database';

const handler = nextConnect();

handler.use(requireApiAuth);
handler.use(middleware);

handler.post(async (req: any, res: any) => {
    const { id } = req.query;

    try {
        if (typeof id !== 'string' || !ObjectId.isValid(id)) {
            throw new ValidationError('Booking id is invalid.');
        }

        const { receivedPerson, receivedPersonRelation, remark, statusDate, statusId } = normalizeBookingStatusPayload(req.body);
        const doc =
            await req.db.collection('bookings')
                .updateOne(
                    {
                        _id: new ObjectId(id)
                    },
                    {
                        $set: { receivedPerson, receivedPersonRelation, shipmentStatus: statusId },
                        $push: { delivery: { remark, statusDate, statusId, updatedDateTime: new Date() } },
                    });
        res.json(doc);

    }
    catch (err: any) {
        const statusCode = err instanceof ValidationError ? err.statusCode : 500;
        res.status(statusCode).send({ error: getErrorMessage(err) })
    }
});

handler.put(async (req: any, res: any) => {
    const { id } = req.query;

    try {
        if (typeof id !== 'string' || !ObjectId.isValid(id)) {
            throw new ValidationError('Booking id is invalid.');
        }

        const { action, remark, statusDate, statusId } = normalizeBookingStatusPayload(req.body, true);

        if (action === 'delete') {
            const doc =
                await req.db.collection('bookings')
                    .updateOne(
                        {
                            _id: new ObjectId(id)
                        },
                        {
                            $pull: { delivery: { remark, statusDate, statusId } },
                        });
            res.json(doc);
        }
    }
    catch (err: any) {
        const statusCode = err instanceof ValidationError ? err.statusCode : 500;
        res.status(statusCode).send({ error: getErrorMessage(err) })
    }
});

export default handler;
