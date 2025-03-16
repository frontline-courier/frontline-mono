import { NextApiResponse } from 'next';
import { withApiAuthRequired, getSession } from '@auth0/nextjs-auth0';
import { ObjectId } from 'mongodb';
import nextConnect from 'next-connect';
import middleware from '../../../helpers/database';

// Using a different approach to avoid TypeScript errors
const handler = async (req: any, res: NextApiResponse) => {
  const session = await getSession(req, res);
  const user = session?.user;

  if (!user) {
    return res.status(401).json({ error: 'Not authenticated' });
  }

  // Get the database connection
  const db = req.db;
  const courierVolumetricMappingsCollection = db.collection('courier_volumetric_mappings');
  const couriersCollection = db.collection('couriers');

  try {
    switch (req.method) {
      case 'GET':
        // Get all mappings with pagination
        const page = parseInt(req.query.page as string) || 1;
        const limit = parseInt(req.query.limit as string) || 10;
        const skip = (page - 1) * limit;

        // Get total count for pagination
        const total = await courierVolumetricMappingsCollection.countDocuments();
        
        // Get mappings with courier information
        const mappings = await courierVolumetricMappingsCollection
          .find({})
          .sort({ updatedAt: -1 })
          .skip(skip)
          .limit(limit)
          .toArray();

        // Get courier details for each mapping
        const mappingsWithDetails = await Promise.all(
          mappings.map(async (mapping: any) => {
            const courier = await couriersCollection.findOne({ CourierId: mapping.courierId });
            
            // Add id field for frontend compatibility
            return {
              ...mapping,
              id: mapping._id.toString(), // Convert ObjectId to string for frontend
              courierName: courier ? courier.Courier : 'Unknown'
            };
          })
        );

        return res.status(200).json({ 
          mappings: mappingsWithDetails, 
          pagination: {
            total,
            page,
            limit,
            totalPages: Math.ceil(total / limit)
          }
        });

      case 'POST':
        // Create a new mapping
        const { courierId, formulaId, transportMode } = req.body;

        if (!courierId || !formulaId || !transportMode) {
          return res.status(400).json({ error: 'Missing required fields' });
        }

        // Check if mapping already exists
        const existingMapping = await courierVolumetricMappingsCollection.findOne({ courierId });

        if (existingMapping) {
          return res.status(400).json({ error: 'Mapping for this courier already exists' });
        }

        // Get courier details
        const courier = await couriersCollection.findOne({ CourierId: courierId });
        
        // Get formula name based on the formula ID
        const formulaNames = {
          1: 'L×B×H/4750',
          2: 'L×B×H/5000',
          3: 'L×B×H/3857',
          4: 'L×B×H/27000×8',
          5: 'L×B×H/3350'
        };

        // Insert new mapping
        const newMapping = {
          courierId,
          formulaId,
          transportMode,
          courierName: courier ? courier.Courier : 'Unknown',
          formulaName: formulaNames[formulaId as keyof typeof formulaNames] || 'Unknown',
          createdAt: new Date(),
          updatedAt: new Date(),
          createdBy: user.email,
          updatedBy: user.email
        };

        const result = await courierVolumetricMappingsCollection.insertOne(newMapping);

        // Return with both _id and id for frontend compatibility
        return res.status(201).json({
          ...newMapping,
          _id: result.insertedId,
          id: result.insertedId.toString()
        });

      default:
        res.setHeader('Allow', ['GET', 'POST']);
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
apiRoute.post(withApiAuthRequired(handler));

export default apiRoute;