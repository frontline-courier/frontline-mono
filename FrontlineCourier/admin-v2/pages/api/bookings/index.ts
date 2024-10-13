import { Db } from 'mongodb';
import nextConnect from 'next-connect';
import middleware from '../../../helpers/database';

const handler = nextConnect();

handler.use(middleware);

handler.get(async (req: any, res: any) => {
    const limit = parseInt(req.query.limit, 10) || 25;
    const page = parseInt(req.query.page, 10)  || 1;
    const awb = req.query.awb || '';
    const ref = req.query.ref || '';
    const courier = parseInt(req.query.courier, 10) || 0;
    const mode = parseInt(req.query.mode, 10) || 0;
    const status = req.query.status || '';

    let docs = [];
    let count = 0;
    let query: any = {};

    if (awb) {
        query.awbNumber = awb;
    }
    if (ref) {
        query.referenceNumber = ref;
    }
    if (courier) {
        query.courier = courier;
    }
    if (mode) {
        query.shipmentMode = mode;
    }
    if (status) {
        query.shipmentStatus = { $regex: status, $options: 'i' };
    }

    try {
        const collection = (req.db as Db).collection('bookings');

        docs = await collection.find(query)
            .sort( { _id: -1 }).skip((page - 1 || 0) * limit).limit(limit).toArray();

        count = await collection.find(query).count();
    
        res.json({booking: [...docs], count: count});
    }
    catch (err) {
        res.send({booking: [], count: 0});
    }
    finally {
        req.dbClient.close();
      }
});

export default handler;