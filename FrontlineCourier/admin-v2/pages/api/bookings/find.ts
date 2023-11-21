import nextConnect from 'next-connect';
import middleware from '../../../helpers/database';

const handler = nextConnect();

handler.use(middleware);

handler.get(async (req: any, res: any) => {
    const { id, track } = req.query;
    let doc;

    try {
        if (track === '1') {
            doc = await req.db.collection('bookings').findOne({ awbNumber: id });
        } else if (track === '2') {
            doc = await req.db.collection('bookings').findOne({ referenceNumber: id });
        }

        delete doc.awbNumber;
        delete doc.shipperName;
        delete doc.receiverName;

        res.json(doc);
    }
    catch (err: any) {
        res.status(500).send({ error: err?.message })
    }
    finally {
        req.dbClient.close();
    }

});

export default handler;
