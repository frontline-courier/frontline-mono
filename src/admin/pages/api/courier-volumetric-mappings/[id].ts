import { NextApiResponse } from 'next';
import { withApiAuthRequired, getSession } from '@auth0/nextjs-auth0';
import { ObjectId } from 'mongodb';
import nextConnect from 'next-connect';
import middleware from '../../../helpers/database';

const handler = async (req: any, res: NextApiResponse) => {
  const session = await getSession(req, res);
  const user = session?.user;

  if (!user) {
    return res.status(401).json({ error: 'Not authenticated' });
  }

  const { id } = req.query;
  
  // Get the database connection
  const db = req.db;
  const courierVolumetricMappingsCollection = db.collection('courier_volumetric_mappings');
  const couriersCollection = db.collection('couriers');
  
  // Safely convert ID to ObjectId
  let objectId;
  try {
    objectId = new ObjectId(id as string);
  } catch (error) {
    return res.status(400).json({ error: 'Invalid ID format' });
  }

  try {
    switch (req.method) {
      case 'GET':
        // Get a specific mapping
        const mapping = await courierVolumetricMappingsCollection.findOne({ _id: objectId });

        if (!mapping) {
          return res.status(404).json({ error: 'Mapping not found' });
        }

        // Get courier details
        const courierDetails = await couriersCollection.findOne({ CourierId: mapping.courierId });
        const mappingWithDetails = {
          ...mapping,
          courierName: courierDetails ? courierDetails.Courier : 'Unknown'
        };

        return res.status(200).json(mappingWithDetails);

      case 'PUT':
        // Update a mapping
        const { courierId, formulaId, transportMode } = req.body;

        if (!courierId || !formulaId || !transportMode) {
          return res.status(400).json({ error: 'Missing required fields' });
        }

        // Check if mapping exists
        const existingMapping = await courierVolumetricMappingsCollection.findOne({ _id: objectId });

        if (!existingMapping) {
          return res.status(404).json({ error: 'Mapping not found' });
        }

        // Check if updating to a courier that already has a different mapping
        const conflictMapping = await courierVolumetricMappingsCollection.findOne({ 
          courierId, 
          _id: { $ne: objectId }
        });

        if (conflictMapping) {
          return res.status(400).json({ error: 'Another mapping for this courier already exists' });
        }

        // Get courier details
        const courierInfo = await couriersCollection.findOne({ CourierId: courierId });
        
        // Get formula name based on the formula ID
        const formulaNames = {
          1: 'L×B×H/4750',
          2: 'L×B×H/5000',
          3: 'L×B×H/3857',
          4: 'L×B×H/27000×8',
          5: 'L×B×H/3350'
        };

        // Update the mapping
        const updateData = {
          courierId,
          formulaId,
          transportMode,
          courierName: courierInfo ? courierInfo.Courier : 'Unknown',
          formulaName: formulaNames[formulaId as keyof typeof formulaNames] || 'Unknown',
          updatedAt: new Date(),
          updatedBy: user.email
        };

        await courierVolumetricMappingsCollection.updateOne(
          { _id: objectId },
          { $set: updateData }
        );

        // Get the updated mapping
        const updatedMapping = await courierVolumetricMappingsCollection.findOne({ _id: objectId });
        
        // Add id field for frontend compatibility
        if (updatedMapping) {
          updatedMapping.id = updatedMapping._id.toString();
        }

        return res.status(200).json(updatedMapping);

      case 'DELETE':
        // Delete a mapping
        const deletedMapping = await courierVolumetricMappingsCollection.findOne({ _id: objectId });

        if (!deletedMapping) {
          return res.status(404).json({ error: 'Mapping not found' });
        }

        await courierVolumetricMappingsCollection.deleteOne({ _id: objectId });

        return res.status(200).json(deletedMapping);

      default:
        res.setHeader('Allow', ['GET', 'PUT', 'DELETE']);
        return res.status(405).end(`Method ${req.method} Not Allowed`);
    }
  } catch (error) {
    console.error('API error:', error);
    return res.status(500).json({ error: 'Internal Server Error' });
  }
};

// Create a handler that uses both Auth0 and our database middleware
const apiRoute = nextConnect({
  onError(error: any, req: any, res: any) {
    res.status(501).json({ error: `Sorry something went wrong! ${error.message}` });
  },
  onNoMatch(req: any, res: any) {
    res.status(405).json({ error: `Method '${req.method}' Not Allowed` });
  },
});

// Apply our database middleware
apiRoute.use(middleware);

// Apply the Auth0 middleware and our handler
apiRoute.get(withApiAuthRequired(handler));
apiRoute.put(withApiAuthRequired(handler));
apiRoute.delete(withApiAuthRequired(handler));

export default apiRoute;