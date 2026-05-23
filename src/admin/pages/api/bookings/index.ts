import { Db } from 'mongodb';
import nextConnect from 'next-connect';
import { getErrorMessage, requireApiAuth } from '../../../helpers/api';
import middleware from '../../../helpers/database';

const handler = nextConnect();

export type BookingFilterParams = {
    awb?: string;
    ref?: string;
    tpn?: string;
    courier?: number;
    mode?: number;
    status?: string;
    paymentMode?: string;
    creditStatus?: string;
};

export function buildBookingsQuery(params: BookingFilterParams) {
    const query: Record<string, unknown> = {};

    if (params.awb) {
        query.awbNumber = params.awb;
    }
    if (params.ref) {
        query.referenceNumber = params.ref;
    }
    if (params.tpn) {
        query.thirdPartyNumber = params.tpn;
    }
    if (params.courier) {
        query.courier = params.courier;
    }
    if (params.mode) {
        query.shipmentMode = params.mode;
    }
    if (params.status) {
        query.shipmentStatus = { $regex: params.status, $options: 'i' };
    }
    if (params.paymentMode) {
        query.paymentMode = params.paymentMode;
    }
    if (params.creditStatus) {
        query.creditStatus = params.creditStatus;
    }

    return query;
}

handler.use(requireApiAuth);
handler.use(middleware);

handler.get(async (req: any, res: any) => {
    const limit = parseInt(req.query.limit, 10) || 25;
    const page = parseInt(req.query.page, 10)  || 1;
    const awb = req.query.awb || '';
    const ref = req.query.ref || '';
    const tpn = req.query.tpn || '';
    const courier = parseInt(req.query.courier, 10) || 0;
    const mode = parseInt(req.query.mode, 10) || 0;
    const status = req.query.status || '';
    const paymentMode = req.query.paymentMode || '';
    const creditStatus = req.query.creditStatus || '';

    let docs = [];
    let count = 0;
    const query = buildBookingsQuery({ awb, ref, tpn, courier, mode, status, paymentMode, creditStatus });

    try {
        const collection = (req.db as Db).collection('bookings');

        docs = await collection.find(query)
            .sort( { _id: -1 }).skip((page - 1 || 0) * limit).limit(limit).toArray();

        count = await collection.countDocuments(query);
    
        res.json({booking: [...docs], count: count});
    }
    catch (err) {
        res.status(500).send({ booking: [], count: 0, error: getErrorMessage(err) });
    }
});

export default handler;