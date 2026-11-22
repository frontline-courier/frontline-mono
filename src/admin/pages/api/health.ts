import type { NextApiRequest, NextApiResponse } from 'next';

/**
 * Liveness probe for the admin API. It intentionally does not touch MongoDB,
 * Auth0, or the courier site: a dependency outage must not make this container
 * look dead.
 */
export default function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET' && req.method !== 'HEAD') {
    res.setHeader('Allow', 'GET, HEAD');
    return res.status(405).json({ error: 'Method not allowed.' });
  }

  res.setHeader('Cache-Control', 'no-store');

  if (req.method === 'HEAD') {
    return res.status(200).end();
  }

  return res.status(200).json({
    status: 'ok',
    service: 'frontline-admin',
    version: (process.env.VERCEL_GIT_COMMIT_SHA ?? 'dev').slice(0, 12),
    timestamp: new Date().toISOString(),
  });
}
