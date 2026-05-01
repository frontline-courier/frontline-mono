import { getSession } from '@auth0/nextjs-auth0';
import type { NextApiRequest, NextApiResponse } from 'next';
import type { Db } from 'mongodb';

export type ApiRequestWithDb = NextApiRequest & {
  db: Db;
};

type NextHandler = (error?: unknown) => void | Promise<void>;

export async function requireApiAuth(
  req: NextApiRequest,
  res: NextApiResponse,
  next: NextHandler,
) {
  const session = await getSession(req, res);

  if (!session?.user) {
    res.status(401).json({ error: 'Not authenticated' });
    return;
  }

  await next();
}

export function getErrorMessage(error: unknown) {
  if (error instanceof Error && error.message) {
    return error.message;
  }

  return 'Internal Server Error';
}
