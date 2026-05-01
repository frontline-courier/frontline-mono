import nextConnect from 'next-connect';
import { getErrorMessage, requireApiAuth } from '../../../helpers/api';
import { normalizeBookingTrackQuery, ValidationError } from '../../../helpers/apiValidation';
import middleware from '../../../helpers/database';

const handler = nextConnect();

handler.use(requireApiAuth);
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

        delete doc.additionalContacts;
        delete doc.shipperName;
        delete doc.receiverName;

        res.json(doc);
    }
    catch (err: any) {
        const statusCode = err instanceof ValidationError ? err.statusCode : 500;
        res.status(statusCode).send({ error: getErrorMessage(err) })
    }

});

export default handler;
