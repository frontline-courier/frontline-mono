import nextConnect from 'next-connect';
import { getErrorMessage } from '../../../helpers/api';
import { normalizeBookingTrackQuery, ValidationError } from '../../../helpers/apiValidation';
import middleware from '../../../helpers/database';

const getModeDisplay = (mode: number | null | undefined): string => {
    if (mode === 2) return 'link';
    if (mode === 3) return 'api';
    return 'internal'; // Default for 0, null, undefined, not exists, 1
};

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

        delete doc.additionalContacts;
        delete doc.shipperName;
        delete doc.receiverName;

        // Enrich with courier info so the client doesn't need a separate /api/couriers call
        const courierId = doc.courier;
        if (courierId != null) {
            const courierDoc = await req.db.collection('couriers').findOne({ CourierId: courierId });
            if (courierDoc) {
                doc.courierName = courierDoc.Courier ?? '';
                doc.courierTrack = courierDoc.Track ?? '';
                doc.courierMode = getModeDisplay(courierDoc.Mode);
            }
        }

        res.json(doc);
    }
    catch (err: any) {
        const statusCode = err instanceof ValidationError ? err.statusCode : 500;
        res.status(statusCode).send({ error: getErrorMessage(err) })
    }

});

export default handler;
