import { Db } from 'mongodb';
import nextConnect from 'next-connect';
import { getErrorMessage, requireApiAuth } from '../../../helpers/api';
import middleware from '../../../helpers/database';

const handler = nextConnect();

handler.use(requireApiAuth);
handler.use(middleware);

handler.get(async (req: any, res: any) => {

  try {
    // stocks
    const stockCollection = (req.db as Db).collection('stocks');
    const stockDocs = await stockCollection.find({out: true});
    const stockCount = await stockCollection.countDocuments({out: true});
    const stocks = Array.from(groupCourier(await stockDocs.toArray()));
    // courier
    const courierCollection = (req.db as Db).collection('stocks_courier');
    const courierDocs = await courierCollection.find();
    const couriers = await courierDocs.toArray();
    // co-courier
    const bookerCollection = (req.db as Db).collection('stocks_booker');
    const bookerDoc = await bookerCollection.find();
    const bookers = await bookerDoc.toArray();

    res.json(
      {
        stocks: stocks, stockCount: stockCount,
        couriers: couriers,
        bookers: bookers,
      }
    );

  }
  catch (err) {
    res.status(500).send({ stocks: [], count: 0, error: getErrorMessage(err) });
  }
});

function groupCourier(arr: any) {
  const map = new Map();

  for (let a of arr) {

    const key = a.courier + a.coloader;
    const exists = map.get(key);

    if (exists) {
      map.set(key, { courier: a.courier, coloader: a.coloader, billCost: a.billCost, awbs: [...exists.awbs, a.awb] });
    } else {
      map.set(key, { courier: a.courier, coloader: a.coloader, billCost: a.billCost, awbs: [a.awb] });
    }
  }

  return map.values();
}

export default handler;