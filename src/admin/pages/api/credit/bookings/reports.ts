import { Db } from 'mongodb';
import nextConnect from 'next-connect';
import { getErrorMessage, requireApiAuth } from '../../../../helpers/api';
import { ValidationError } from '../../../../helpers/apiValidation';
import middleware from '../../../../helpers/database';

const handler = nextConnect();

handler.use(requireApiAuth);
handler.use(middleware);

const surchargeExpression = {
  $add: [
    { $ifNull: ['$odaEdl', 0] },
    { $ifNull: ['$carrierInsurance', 0] },
    { $ifNull: ['$fovRisk', 0] },
  ],
};

const totalExpression = {
  $ifNull: [
    '$total',
    {
      $add: [
        { $ifNull: ['$amount', 0] },
        { $ifNull: ['$odaEdl', 0] },
        { $ifNull: ['$carrierInsurance', 0] },
        { $ifNull: ['$fovRisk', 0] },
      ],
    },
  ],
};

function parseDateQuery(value: unknown, fieldName: string) {
  if (!value) {
    return undefined;
  }

  const parsedDate = new Date(String(value));

  if (Number.isNaN(parsedDate.getTime())) {
    throw new ValidationError(`${fieldName} must be a valid date.`);
  }

  return parsedDate;
}

function normalizeStartDate(date: Date) {
  const normalizedDate = new Date(date);
  normalizedDate.setHours(0, 0, 0, 0);
  return normalizedDate;
}

function normalizeEndDate(date: Date) {
  const normalizedDate = new Date(date);
  normalizedDate.setHours(23, 59, 59, 999);
  return normalizedDate;
}

function buildBreakdownPipeline(fieldName: string) {
  return [
    {
      $group: {
        _id: { $ifNull: [`$${fieldName}`, 'Unknown'] },
        bookingCount: { $sum: 1 },
        totalAmount: { $sum: { $ifNull: ['$amount', 0] } },
        totalSurcharges: { $sum: surchargeExpression },
        totalRevenue: { $sum: totalExpression },
        totalWeight: { $sum: { $ifNull: ['$actualWeight', 0] } },
      },
    },
    {
      $project: {
        _id: 0,
        name: '$_id',
        bookingCount: 1,
        totalAmount: 1,
        totalSurcharges: 1,
        totalRevenue: 1,
        totalWeight: 1,
        averageRevenue: {
          $cond: [
            { $eq: ['$bookingCount', 0] },
            0,
            { $divide: ['$totalRevenue', '$bookingCount'] },
          ],
        },
      },
    },
    {
      $sort: {
        totalRevenue: -1,
        name: 1,
      },
    },
    {
      $limit: 10,
    },
  ];
}

handler.get(async (req: any, res: any) => {
  try {
    const { startDate, endDate, client, courier, mode, service } = req.query;
    const parsedStartDate = parseDateQuery(startDate, 'Start date');
    const parsedEndDate = parseDateQuery(endDate, 'End date');

    if (parsedStartDate && parsedEndDate && parsedStartDate > parsedEndDate) {
      throw new ValidationError('Start date cannot be after end date.');
    }

    const match: Record<string, unknown> = {};

    if (client) {
      match.client = String(client);
    }

    if (courier) {
      match.courier = String(courier);
    }

    if (mode) {
      match.mode = String(mode);
    }

    if (service) {
      match.service = String(service);
    }

    if (parsedStartDate || parsedEndDate) {
      match.bookedDate = {};

      if (parsedStartDate) {
        (match.bookedDate as Record<string, Date>).$gte = normalizeStartDate(parsedStartDate);
      }

      if (parsedEndDate) {
        (match.bookedDate as Record<string, Date>).$lte = normalizeEndDate(parsedEndDate);
      }
    }

    const collection = (req.db as Db).collection('credit_bookings');

    const [summaryResult, clientBreakdown, courierBreakdown, modeBreakdown, serviceBreakdown, recentBookings] = await Promise.all([
      collection
        .aggregate([
          { $match: match },
          {
            $group: {
              _id: null,
              totalBookings: { $sum: 1 },
              totalAmount: { $sum: { $ifNull: ['$amount', 0] } },
              totalSurcharges: { $sum: surchargeExpression },
              totalRevenue: { $sum: totalExpression },
              totalWeight: { $sum: { $ifNull: ['$actualWeight', 0] } },
            },
          },
          {
            $project: {
              _id: 0,
              totalBookings: 1,
              totalAmount: 1,
              totalSurcharges: 1,
              totalRevenue: 1,
              totalWeight: 1,
              averageRevenue: {
                $cond: [
                  { $eq: ['$totalBookings', 0] },
                  0,
                  { $divide: ['$totalRevenue', '$totalBookings'] },
                ],
              },
            },
          },
        ])
        .toArray(),
      collection.aggregate([{ $match: match }, ...buildBreakdownPipeline('client')]).toArray(),
      collection.aggregate([{ $match: match }, ...buildBreakdownPipeline('courier')]).toArray(),
      collection.aggregate([{ $match: match }, ...buildBreakdownPipeline('mode')]).toArray(),
      collection.aggregate([{ $match: match }, ...buildBreakdownPipeline('service')]).toArray(),
      collection
        .find(match)
        .project({
          client: 1,
          pod: 1,
          courier: 1,
          mode: 1,
          service: 1,
          destination: 1,
          bookedDate: 1,
          amount: 1,
          total: 1,
          odaEdl: 1,
          carrierInsurance: 1,
          fovRisk: 1,
        })
        .sort({ bookedDate: -1, _id: -1 })
        .limit(10)
        .toArray(),
    ]);

    const summary = summaryResult[0] || {
      totalBookings: 0,
      totalAmount: 0,
      totalSurcharges: 0,
      totalRevenue: 0,
      totalWeight: 0,
      averageRevenue: 0,
    };

    res.json({
      summary,
      breakdowns: {
        clients: clientBreakdown,
        couriers: courierBreakdown,
        modes: modeBreakdown,
        services: serviceBreakdown,
      },
      recentBookings: recentBookings.map((booking) => ({
        ...booking,
        total:
          booking.total ??
          (Number(booking.amount || 0) +
            Number(booking.odaEdl || 0) +
            Number(booking.carrierInsurance || 0) +
            Number(booking.fovRisk || 0)),
      })),
    });
  } catch (err: any) {
    const statusCode = err instanceof ValidationError ? err.statusCode : 500;
    res.status(statusCode).send({ error: getErrorMessage(err) });
  }
});

export default handler;