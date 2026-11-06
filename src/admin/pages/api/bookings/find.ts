import nextConnect from 'next-connect';
import { getErrorMessage } from '../../../helpers/api';
import { normalizeBookingTrackQuery, ValidationError } from '../../../helpers/apiValidation';
import middleware from '../../../helpers/database';
import { toPublicBooking } from '../../../helpers/publicBooking';

const handler = nextConnect();

handler.use(middleware);

handler.get(async (req: any, res: any) => {
    const { id } = req.query;
    let doc;

    try {
        const track = normalizeBookingTrackQuery(req.query.track);
        const bookingId = typeof id === 'string' ? id.trim() : '';

        if (!bookingId) {
            throw new ValidationError('Id is required.');
        }

        if (track === '1') {
            doc = await req.db.collection('bookings').findOne({ awbNumber: bookingId });
        } else if (track === '2') {
            doc = await req.db.collection('bookings').findOne({ referenceNumber: bookingId });
        }

        if (!doc) {
            return res.status(404).json({ error: 'Booking not found.' });
        }

        const courierId = Number(doc.courier);
        const courierDoc = Number.isFinite(courierId) && courierId > 0
            ? await req.db.collection('couriers').findOne({ CourierId: courierId })
            : null;

        res.json(toPublicBooking(doc, courierDoc));
    }
    catch (err: any) {
        const statusCode = err instanceof ValidationError ? err.statusCode : 500;
        res.status(statusCode).send({ error: getErrorMessage(err) })
    }

});

export default handler;
