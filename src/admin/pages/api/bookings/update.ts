import { ObjectId } from 'mongodb';
import nextConnect from 'next-connect';
import { getErrorMessage, requireApiAuth } from '../../../helpers/api';
import { normalizeBookingPayload, ValidationError } from '../../../helpers/apiValidation';
import middleware from '../../../helpers/database';

const INTERNATIONAL_SHIPMENT_MODE = 2;

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

        const data = normalizeBookingPayload(payload, true);
        const unsetPayload: Record<string, string> = {
            coCourier: '',
            billAmount: '',
        };

        if (data.shipmentMode !== undefined && data.shipmentMode !== INTERNATIONAL_SHIPMENT_MODE) {
            unsetPayload.importDuty = '';
        }

        let doc = await req.db.collection('bookings').updateOne({
            _id: new ObjectId(id)
        },
            {
                $set: data,
                // TODO: can remove later
                // these are fields that are no longer used but we want to remove them from existing documents
                $unset: unsetPayload,
            });

        res.json(doc);
    }
    catch (err: any) {
        const statusCode = err instanceof ValidationError ? err.statusCode : 500;
        res.status(statusCode).send({ error: getErrorMessage(err) })
    }
});

export default handler;
