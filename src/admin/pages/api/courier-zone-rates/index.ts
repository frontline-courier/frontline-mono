import { Db } from 'mongodb';
import nextConnect from 'next-connect';
import { getErrorMessage, requireApiAuth } from '../../../helpers/api';
import middleware from '../../../helpers/database';
import { isNumericInput } from '../../../helpers/numbers';

const handler = nextConnect();

handler.use(requireApiAuth);
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
    res.status(500).json({ error: getErrorMessage(err) || 'Failed to fetch courier zone rates' });
  }
});

// POST handler to create/update courier zone rates
handler.post(async (req: any, res: any) => {
  try {
    const collection = (req.db as Db).collection('courierZoneRates');
    const { courier, zone, transportMode, weightSlabs } = req.body;

    const numericCourier = Number(courier);
    const numericTransportMode = Number(transportMode);

    // Validate required fields
    if (
      !isNumericInput(courier)
      || !isNumericInput(transportMode)
      || numericCourier <= 0
      || numericTransportMode <= 0
      || !zone
      || !weightSlabs
    ) {
      return res.status(400).json({ error: 'Missing or invalid required fields' });
    }

    // Check if rate mapping already exists
    const existingRate = await collection.findOne({
      courier: numericCourier,
      zone,
      transportMode: numericTransportMode
    });

    if (existingRate) {
      // Update existing rate
      await collection.updateOne(
        { courier: numericCourier, zone, transportMode: numericTransportMode },
        { $set: { weightSlabs, updatedAt: new Date() } }
      );
      res.json({ message: 'Courier zone rates updated successfully' });
    } else {
      // Create new rate mapping
      await collection.insertOne({
        courier: numericCourier,
        zone,
        transportMode: numericTransportMode,
        weightSlabs,
        createdAt: new Date(),
        updatedAt: new Date()
      });
      res.json({ message: 'Courier zone rates created successfully' });
    }
  } catch (err) {
    res.status(500).json({ error: getErrorMessage(err) || 'Failed to save courier zone rates' });
  }
});

export default handler; 