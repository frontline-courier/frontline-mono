import { NextApiResponse } from 'next';
import { withApiAuthRequired, getSession } from '@auth0/nextjs-auth0';
import nextConnect from 'next-connect';
import middleware from '../../../helpers/database';

const handler = async (req: any, res: NextApiResponse) => {
  const session = await getSession(req, res);
  const user = session?.user;

  if (!user) {
    return res.status(401).json({ error: 'Not authenticated' });
  }

  try {
    switch (req.method) {
      case 'GET':
        // Instead of querying the database, we'll return hardcoded formulas
        // since these are static values as mentioned in the requirements
        const formulas = [
          { id: 1, formula: 'L×B×H/4750', description: 'Standard volumetric formula with divisor 4750' },
          { id: 2, formula: 'L×B×H/5000', description: 'Standard volumetric formula with divisor 5000' },
          { id: 3, formula: 'L×B×H/3857', description: 'Standard volumetric formula with divisor 3857' },
          { id: 4, formula: 'L×B×H/27000×8', description: 'Special volumetric formula' },
          { id: 5, formula: 'L×B×H/3350', description: 'Standard volumetric formula with divisor 3350' }
        ];

        return res.status(200).json(formulas);

      default:
        res.setHeader('Allow', ['GET']);
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

export default apiRoute;
