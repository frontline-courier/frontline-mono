import { Db } from 'mongodb';
import nextConnect from 'next-connect';
import middleware from '../../../helpers/database';
import { getCache, setCache } from '../../../lib/cache'; // Import cache functions

const handler = nextConnect();

handler.use(middleware);

handler.get(async (req: any, res: any) => {
  const cachedData = getCache(); // Check for cached data

  if (cachedData) {
    console.log('Serving from cache');
    return res.json(cachedData); // Return cached response
  }

  try {
    const collection = (req.db as Db).collection('couriers');
    const docs = await collection.find();
    const count = await docs.count();
    
    // Convert to array and sort by Courier name alphabetically
    const couriersArray = await docs.toArray();
    const sortedCouriers = couriersArray.sort((a, b) => {
      return a.Courier.localeCompare(b.Courier, undefined, { sensitivity: 'base' });
    });

    const responseData = { couriers: sortedCouriers, count: count };
    setCache(responseData); // Cache the response

    res.json(responseData);
  } catch (err) {
    res.send({ couriers: [], count: 0 });
  } finally {
    req.dbClient.close();
  }
});

export default handler;