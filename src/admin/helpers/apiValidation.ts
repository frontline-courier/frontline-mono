import { ObjectId } from 'mongodb';
import { bookedByOptions } from '../constants/bookedByOptions';
import { creditClients } from '../constants/credit/clients';
import { creditCourier } from '../constants/credit/couriers';
import { creditModes } from '../constants/credit/mode';
import { creditServices } from '../constants/credit/service';
import { statusRelation } from '../constants/deliveryRelation';
import { paymentModes } from '../constants/paymentModes';
import { courierStatus } from '../constants/shipmentStatus';

export class ValidationError extends Error {
  statusCode: number;

  constructor(message: string, statusCode = 400) {
    super(message);
    this.name = 'ValidationError';
    this.statusCode = statusCode;
  }
}

const bookedBySet = new Set(bookedByOptions);
const paymentModeSet = new Set(paymentModes);
const creditClientSet = new Set(creditClients.map((client) => client.name));
const creditCourierSet = new Set(creditCourier);
const creditModeSet = new Set(creditModes);
const creditServiceSet = new Set(creditServices);
const relationSet = new Set(statusRelation.map((relation) => relation.Name));
const shipmentStatusSet = new Set(courierStatus.map((status) => status.ShipmentStatus));

function ensureRecord(value: unknown, fieldName = 'Request body') {
  if (!value || typeof value !== 'object' || Array.isArray(value)) {
    throw new ValidationError(`${fieldName} must be an object.`);
  }

  return value as Record<string, unknown>;
}

function ensureTrimmedString(
  value: unknown,
  fieldName: string,
  options: { required?: boolean } = {},
) {
  if (value === undefined || value === null || value === '') {
    if (options.required) {
      throw new ValidationError(`${fieldName} is required.`);
    }

    return undefined;
  }

  if (typeof value !== 'string') {
    throw new ValidationError(`${fieldName} must be a string.`);
  }

  const trimmedValue = value.trim();

  if (!trimmedValue) {
    if (options.required) {
      throw new ValidationError(`${fieldName} is required.`);
    }

    return undefined;
  }

  return trimmedValue;
}

function ensureFiniteNumber(
  value: unknown,
  fieldName: string,
  options: { required?: boolean; integer?: boolean } = {},
) {
  if (value === undefined || value === null || value === '') {
    if (options.required) {
      throw new ValidationError(`${fieldName} is required.`);
    }

    return undefined;
  }

  const parsedValue = typeof value === 'number' ? value : Number(value);

  if (!Number.isFinite(parsedValue)) {
    throw new ValidationError(`${fieldName} must be a valid number.`);
  }

  if (options.integer && !Number.isInteger(parsedValue)) {
    throw new ValidationError(`${fieldName} must be an integer.`);
  }

  return parsedValue;
}

function ensureDate(value: unknown, fieldName: string, required = false) {
  if (value === undefined || value === null || value === '') {
    if (required) {
      throw new ValidationError(`${fieldName} is required.`);
    }

    return undefined;
  }

  const parsedDate = value instanceof Date ? value : new Date(String(value));

  if (Number.isNaN(parsedDate.getTime())) {
    throw new ValidationError(`${fieldName} must be a valid date.`);
  }

  return parsedDate;
}

function setValueIfDefined(
  target: Record<string, unknown>,
  key: string,
  value: unknown,
) {
  if (value !== undefined) {
    target[key] = value;
  }
}

function ensureAllowedString(
  value: unknown,
  fieldName: string,
  allowedValues: Set<string>,
  options: { required?: boolean } = {},
) {
  const normalizedValue = ensureTrimmedString(value, fieldName, options);

  if (normalizedValue === undefined) {
    return undefined;
  }

  if (!allowedValues.has(normalizedValue)) {
    throw new ValidationError(`${fieldName} is invalid.`);
  }

  return normalizedValue;
}

export function parseObjectId(value: unknown, fieldName = 'id') {
  const normalizedValue = ensureTrimmedString(value, fieldName, { required: true });

  if (!normalizedValue || !ObjectId.isValid(normalizedValue)) {
    throw new ValidationError(`${fieldName} must be a valid id.`);
  }

  return new ObjectId(normalizedValue);
}

export function normalizeBookingPayload(input: unknown, partial = false) {
  const body = ensureRecord(input);
  const normalizedPayload: Record<string, unknown> = {};

  setValueIfDefined(normalizedPayload, 'awbNumber', ensureTrimmedString(body.awbNumber, 'AWB Number', { required: !partial }));
  setValueIfDefined(normalizedPayload, 'referenceNumber', ensureTrimmedString(body.referenceNumber, 'Reference Number'));
  setValueIfDefined(normalizedPayload, 'bookedDate', ensureDate(body.bookedDate, 'Booked Date', !partial));
  setValueIfDefined(normalizedPayload, 'courier', ensureFiniteNumber(body.courier, 'Courier', { required: !partial, integer: true }));
  setValueIfDefined(normalizedPayload, 'shipperName', ensureTrimmedString(body.shipperName, 'Shipper Name'));
  setValueIfDefined(normalizedPayload, 'origin', ensureTrimmedString(body.origin, 'Origin'));
  setValueIfDefined(normalizedPayload, 'doxType', ensureFiniteNumber(body.doxType, 'Dox Type', { integer: true }));
  setValueIfDefined(normalizedPayload, 'receiverName', ensureTrimmedString(body.receiverName, 'Receiver Name'));
  setValueIfDefined(normalizedPayload, 'destination', ensureTrimmedString(body.destination, 'Destination'));
  setValueIfDefined(normalizedPayload, 'shipmentMode', ensureFiniteNumber(body.shipmentMode, 'Shipment Mode', { required: !partial, integer: true }));
  setValueIfDefined(normalizedPayload, 'transportMode', ensureFiniteNumber(body.transportMode, 'Transport Mode', { integer: true }));
  setValueIfDefined(normalizedPayload, 'coCourier', ensureFiniteNumber(body.coCourier, 'Co Courier', { integer: true }));
  setValueIfDefined(normalizedPayload, 'bookingAmount', ensureFiniteNumber(body.bookingAmount, 'Booking Amount'));
  setValueIfDefined(normalizedPayload, 'billAmount', ensureFiniteNumber(body.billAmount, 'Bill Amount'));
  setValueIfDefined(normalizedPayload, 'actualWeight', ensureFiniteNumber(body.actualWeight, 'Actual Weight'));
  setValueIfDefined(normalizedPayload, 'bookedBy', ensureAllowedString(body.bookedBy, 'Booked By', bookedBySet));
  setValueIfDefined(normalizedPayload, 'paymentMode', ensureAllowedString(body.paymentMode, 'Payment Mode', paymentModeSet));
  setValueIfDefined(normalizedPayload, 'remarks', ensureTrimmedString(body.remarks, 'Remarks'));
  setValueIfDefined(normalizedPayload, 'internalRemarks', ensureTrimmedString(body.internalRemarks, 'Internal Remarks'));
  setValueIfDefined(normalizedPayload, 'deliveryOfficeLocation', ensureTrimmedString(body.deliveryOfficeLocation, 'Delivery Office Location'));
  setValueIfDefined(normalizedPayload, 'additionalContacts', ensureTrimmedString(body.additionalContacts, 'Additional Contacts'));
  setValueIfDefined(normalizedPayload, 'additionalWeights', ensureTrimmedString(body.additionalWeights, 'Additional Weights'));
  setValueIfDefined(normalizedPayload, 'additionalLeaf', ensureTrimmedString(body.additionalLeaf, 'Additional Leaf'));
  setValueIfDefined(normalizedPayload, 'thirdPartyNumber', ensureTrimmedString(body.thirdPartyNumber, 'Third Party Number'));

  return normalizedPayload;
}

export function normalizeCourierPayload(input: unknown) {
  const body = ensureRecord(input);

  return {
    CourierId: ensureFiniteNumber(body.CourierId, 'CourierId', { required: true, integer: true }),
    Courier: ensureTrimmedString(body.Courier, 'Courier', { required: true }),
    Description: ensureTrimmedString(body.Description, 'Description'),
    Track: ensureTrimmedString(body.Track, 'Track'),
    Mode: ensureFiniteNumber(body.Mode, 'Mode', { integer: true }) ?? 1,
    Status: ensureFiniteNumber(body.Status, 'Status', { integer: true }) ?? 1,
  };
}

export function normalizeStockEntriesPayload(input: unknown) {
  if (!Array.isArray(input) || input.length === 0) {
    throw new ValidationError('Stock entries must be a non-empty array.');
  }

  return input.map((entry, index) => {
    const body = ensureRecord(entry, `Stock entry ${index + 1}`);

    return {
      ...body,
      awb: ensureTrimmedString(body.awb, 'AWB', { required: true }),
      courier: ensureTrimmedString(body.courier, 'Courier', { required: true }),
      coloader: ensureTrimmedString(body.coloader, 'Co-loader'),
      billCost: ensureFiniteNumber(body.billCost, 'Bill Cost'),
      booker: ensureTrimmedString(body.booker, 'Booker'),
      updatedDateTime: body.updatedDateTime,
      createdDateTime: body.createdDateTime,
      out: body.out,
    };
  });
}

export function normalizeStockOutPayload(input: unknown) {
  const body = ensureRecord(input);

  if (!Array.isArray(body.awb) || body.awb.length === 0) {
    throw new ValidationError('AWB must be a non-empty array.');
  }

  return {
    awb: body.awb.map((awb, index) => ensureTrimmedString(awb, `AWB ${index + 1}`, { required: true })),
    courier: ensureTrimmedString(body.courier, 'Courier', { required: true }),
  };
}

export function normalizeNamedEntityPayload(input: unknown, fieldName: string) {
  const body = ensureRecord(input);

  return ensureTrimmedString(body[fieldName], fieldName, { required: true });
}

export function normalizeBookerPayload(input: unknown) {
  const body = ensureRecord(input);

  return {
    name: ensureTrimmedString(body.name, 'name', { required: true }),
    type: ensureTrimmedString(body.type, 'type', { required: true }),
  };
}

export function normalizeCourierStockPayload(input: unknown) {
  const body = ensureRecord(input);

  return {
    name: ensureTrimmedString(body.courier, 'Courier', { required: true }),
    type: ensureTrimmedString(body.type, 'Type', { required: true }),
  };
}

export function normalizeCreditBookingPayload(input: unknown, partial = false) {
  const body = ensureRecord(input);
  const normalizedPayload: Record<string, unknown> = {};

  setValueIfDefined(normalizedPayload, 'client', ensureAllowedString(body.client, 'Client', creditClientSet, { required: !partial }));
  setValueIfDefined(normalizedPayload, 'bookedDate', ensureDate(body.bookedDate, 'Booked Date', !partial));
  setValueIfDefined(normalizedPayload, 'pod', ensureTrimmedString(body.pod, 'POD', { required: !partial }));
  setValueIfDefined(normalizedPayload, 'destination', ensureTrimmedString(body.destination, 'Destination', { required: !partial }));
  setValueIfDefined(normalizedPayload, 'pinCode', ensureTrimmedString(body.pinCode, 'Pin Code', { required: !partial }));
  setValueIfDefined(normalizedPayload, 'courier', ensureAllowedString(body.courier, 'Courier', creditCourierSet, { required: !partial }));
  setValueIfDefined(normalizedPayload, 'mode', ensureAllowedString(body.mode, 'Mode', creditModeSet, { required: !partial }));
  setValueIfDefined(normalizedPayload, 'service', ensureAllowedString(body.service, 'Service', creditServiceSet, { required: !partial }));
  setValueIfDefined(normalizedPayload, 'volWeight', ensureTrimmedString(body.volWeight, 'Vol Weight'));
  setValueIfDefined(normalizedPayload, 'actualWeight', ensureFiniteNumber(body.actualWeight, 'Actual Weight'));
  setValueIfDefined(normalizedPayload, 'amount', ensureFiniteNumber(body.amount, 'Amount', { required: !partial }));
  setValueIfDefined(normalizedPayload, 'odaEdl', ensureFiniteNumber(body.odaEdl, 'ODA / EDL'));
  setValueIfDefined(normalizedPayload, 'carrierInsurance', ensureFiniteNumber(body.carrierInsurance, 'Carrier Insurance'));
  setValueIfDefined(normalizedPayload, 'fovRisk', ensureFiniteNumber(body.fovRisk, 'FOV Risk'));
  setValueIfDefined(normalizedPayload, 'total', ensureFiniteNumber(body.total, 'Total'));
  setValueIfDefined(normalizedPayload, 'createdBy', ensureTrimmedString(body.createdBy, 'Created By'));
  setValueIfDefined(normalizedPayload, 'updatedBy', ensureTrimmedString(body.updatedBy, 'Updated By'));

  return normalizedPayload;
}

export function normalizeBookingStatusPayload(input: unknown, allowDelete = false) {
  const body = ensureRecord(input);
  const normalizedPayload: Record<string, unknown> = {};

  if (allowDelete) {
    const action = ensureTrimmedString(body.action, 'Action', { required: true });

    if (action !== 'delete') {
      throw new ValidationError('Action is invalid.');
    }

    normalizedPayload.action = action;
  }

  setValueIfDefined(normalizedPayload, 'receivedPerson', ensureTrimmedString(body.receivedPerson, 'Receiver Name'));
  setValueIfDefined(
    normalizedPayload,
    'receivedPersonRelation',
    ensureAllowedString(body.receivedPersonRelation, 'Receiver Relation', relationSet),
  );
  setValueIfDefined(normalizedPayload, 'remark', ensureTrimmedString(body.remark, 'Remark'));
  setValueIfDefined(normalizedPayload, 'statusDate', ensureDate(body.statusDate, 'Status Date', true));
  setValueIfDefined(
    normalizedPayload,
    'statusId',
    ensureAllowedString(body.statusId, 'Status', shipmentStatusSet, { required: true }),
  );

  return normalizedPayload;
}

export function normalizeBookingTrackQuery(track: unknown) {
  const normalizedTrack = ensureTrimmedString(track, 'Track', { required: true });

  if (normalizedTrack !== '1' && normalizedTrack !== '2') {
    throw new ValidationError('Track is invalid.');
  }

  return normalizedTrack;
}
