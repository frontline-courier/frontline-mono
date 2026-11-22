import type { NextApiRequest, NextApiResponse } from 'next';
import { getErrorMessage } from '../../../helpers/api';
import {
  normalizeShreeTirupatiAwb,
  resolveShreeTirupatiTrackingUrl,
  ShreeTirupatiTrackingError,
} from '../../../helpers/shreeTirupatiTracking';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') {
    res.setHeader('Allow', 'GET');
    return res.status(405).json({ error: 'Method not allowed.' });
  }

  try {
    const rawAwb = Array.isArray(req.query.awb) ? req.query.awb[0] : req.query.awb;
    const rawTrackingNo = Array.isArray(req.query.trackingno)
      ? req.query.trackingno[0]
      : req.query.trackingno;
    const rawFormat = Array.isArray(req.query.format) ? req.query.format[0] : req.query.format;

    const awb = normalizeShreeTirupatiAwb(rawAwb ?? rawTrackingNo);
    const url = await resolveShreeTirupatiTrackingUrl(awb);

    res.setHeader('Cache-Control', 'private, max-age=300');

    if (rawFormat === 'json') {
      return res.status(200).json({ awb, trackingUrl: url });
    }

    return res.redirect(302, url);
  } catch (error) {
    const statusCode = error instanceof ShreeTirupatiTrackingError ? error.statusCode : 502;
    return res.status(statusCode).json({ error: getErrorMessage(error) });
  }
}
