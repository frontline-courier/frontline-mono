import { ObjectId } from 'bson';
import nextConnect from 'next-connect';
import middleware from '../../../../helpers/database';

const handler = nextConnect();

handler.use(middleware);

handler.post(async (req: any, res: any) => {
    const { id } = req.query;
    const { receivedPerson, receivedPersonRelation, remark, statusDate, statusId } = req.body;

    try {
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
        res.status(500).send({ error: err?.message })
    }
    finally {
        req.dbClient.close();
    }
});

handler.put(async (req: any, res: any) => {
    const { id } = req.query;
    const { action, remark, statusDate, statusId, receiverName, receivedPersonRelation } = req.body;

    try {
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
        res.status(500).send({ error: err?.message })
    }
    finally {
        req.dbClient.close();
    }
});

export default handler;
