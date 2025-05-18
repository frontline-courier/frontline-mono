import { Db } from 'mongodb';
import nextConnect from 'next-connect';
import middleware from '../../../helpers/database';

const handler = nextConnect();

handler.use(middleware);

// GET handler to fetch courier zone rates
handler.get(async (req: any, res: any) => {
  try {
    const collection = (req.db as Db).collection('courierZoneRates');
    const { courier, zone, transportMode } = req.query;

    let query = {};
    if (courier) query = { ...query, courier: Number(courier) };
    if (zone) query = { ...query, zone };
    if (transportMode) query = { ...query, transportMode: Number(transportMode) };

    const rates = await collection.find(query).toArray();
    res.json({ rates });
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch courier zone rates' });
  } finally {
    req.dbClient.close();
  }
});

// POST handler to create/update courier zone rates
handler.post(async (req: any, res: any) => {
  try {
    const collection = (req.db as Db).collection('courierZoneRates');
    const { courier, zone, transportMode, weightSlabs } = req.body;

    // Validate required fields
    if (!courier || !zone || !transportMode || !weightSlabs) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    // Check if rate mapping already exists
    const existingRate = await collection.findOne({
      courier: Number(courier),
      zone,
      transportMode: Number(transportMode)
    });

    if (existingRate) {
      // Update existing rate
      await collection.updateOne(
        { courier: Number(courier), zone, transportMode: Number(transportMode) },
        { $set: { weightSlabs, updatedAt: new Date() } }
      );
      res.json({ message: 'Courier zone rates updated successfully' });
    } else {
      // Create new rate mapping
      await collection.insertOne({
        courier: Number(courier),
        zone,
        transportMode: Number(transportMode),
        weightSlabs,
        createdAt: new Date(),
        updatedAt: new Date()
      });
      res.json({ message: 'Courier zone rates created successfully' });
    }
  } catch (err) {
    res.status(500).json({ error: 'Failed to save courier zone rates' });
  } finally {
    req.dbClient.close();
  }
});

export default handler; 