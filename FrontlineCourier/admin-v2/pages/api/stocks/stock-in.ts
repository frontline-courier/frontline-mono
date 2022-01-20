import { Db } from 'mongodb';
import nextConnect from 'next-connect';
import middleware from '../../../helpers/database';

const handler = nextConnect();

handler.use(middleware);

handler.get(async (req: any, res: any) => {

  try {
    // stock
    const stockCollection = (req.db as Db).collection('stocks');
    const stockDocs = await stockCollection.find();
    const stockCount = await stockDocs.count();
    const stocks = await stockDocs.toArray();
    // courier
    const courierCollection = (req.db as Db).collection('stocks_courier');
    const courierDocs = await courierCollection.find();
    const couriers = await courierDocs.toArray();
    // co-courier
    const coLoaderCollection = (req.db as Db).collection('stocks_coloader');
    const coLoaderDocs = await coLoaderCollection.find();
    const coloaders = await coLoaderDocs.toArray();

    res.json(
      {
        stocks: stocks, stockCount: stockCount,
        couriers: couriers,
        coloaders: coloaders,
     }
     );
  
  }
  catch (err) {
    res.send({ stocks: [], count: 0 });
  }
  finally {
    req.dbClient.close();
  }
});

export default handler;