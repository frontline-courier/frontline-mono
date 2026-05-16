export type CourierStatusEntry = {
  StatusId: number;
  ShipmentStatus: string;
  Sequence: number | string;
  Description: number | string;
};

export const courierStatus: CourierStatusEntry[] = [
  {
    StatusId: 1,
    ShipmentStatus: 'Booked',
    Sequence: 'NULL',
    Description: 'NULL'
  },
  {
    StatusId: 2,
    ShipmentStatus: 'In Transit',
    Sequence: 'NULL',
    Description: 'NULL'
  },
  {
    StatusId: 3,
    ShipmentStatus: 'Pending',
    Sequence: 'NULL',
    Description: 'NULL'
  },
  {
    StatusId: 4,
    ShipmentStatus: 'Late booking',
    Sequence: 'NULL',
    Description: 'NULL'
  },
  {
    StatusId: 5,
    ShipmentStatus: 'Waiting for Customs',
    Sequence: 'NULL',
    Description: 'NULL'
  },
  {
    StatusId: 6,
    ShipmentStatus: 'Reached Destination',
    Sequence: 'NULL',
    Description: 'NULL'
  },
  {
    StatusId: 7,
    ShipmentStatus: 'Delivered',
    Sequence: 'NULL',
    Description: 'NULL'
  },
  {
    StatusId: 8,
    ShipmentStatus: 'Door locked 1st day',
    Sequence: 'NULL',
    Description: 'NULL'
  },
  {
    StatusId: 9,
    ShipmentStatus: 'Returned to Origin',
    Sequence: 'NULL',
    Description: 1
  },
  {
    StatusId: 10,
    ShipmentStatus: 'Incorrect Address',
    Sequence: 'NULL',
    Description: 1
  },
  {
    StatusId: 11,
    ShipmentStatus: 'Wrong Phone Number or Not Reachable',
    Sequence: 'NULL',
    Description: 1
  },
  {
    StatusId: 12,
    ShipmentStatus: 'Wrong Pincode in Shipment',
    Sequence: 'NULL',
    Description: 1
  },
  {
    StatusId: 13,
    ShipmentStatus: 'No Service Area',
    Sequence: 'NULL',
    Description: 1
  },
  {
    StatusId: 14,
    ShipmentStatus: 'Re booking in Courier',
    Sequence: 'NULL',
    Description: 'NULL'
  },
  {
    StatusId: 15,
    ShipmentStatus: 'Taken for Delivery',
    Sequence: 'NULL',
    Description: 'NULL'
  },
  {
    StatusId: 16,
    ShipmentStatus: 'Door locked 2nd day',
    Sequence: 'NULL',
    Description: 'NULL'
  },
  {
    StatusId: 17,
    ShipmentStatus: 'Address not found',
    Sequence: 'NULL',
    Description: 'NULL'
  },
  {
    StatusId: 18,
    ShipmentStatus: 'Miss Route',
    Sequence: 'NULL',
    Description: 'NULL'
  },
  {
    StatusId: 19,
    ShipmentStatus: 'Late Booking',
    Sequence: 'NULL',
    Description: 'NULL'
  },
  {
    StatusId: 20,
    ShipmentStatus: 'Load Late - Cutoff',
    Sequence: 'NULL',
    Description: 'NULL'
  },
  {
    StatusId: 21,
    ShipmentStatus: 'Refused to Accept',
    Sequence: 'NULL',
    Description: 'NULL'
  },
  {
    StatusId: 22,
    ShipmentStatus: 'Customer Not Available',
    Sequence: 'NULL',
    Description: 'NULL'
  },
  {
    StatusId: 23,
    ShipmentStatus: 'Canceled by Shipper',
    Sequence: 'NULL',
    Description: 'NULL'
  },
  {
    StatusId: 24,
    ShipmentStatus: 'Improper Paper Works',
    Sequence: 'NULL',
    Description: 'NULL'
  },
  {
    StatusId: 25,
    ShipmentStatus: 'Clearance process Ok',
    Sequence: 'NULL',
    Description: 'NULL'
  },
  {
    StatusId: 26,
    ShipmentStatus: 'Clearance pending',
    Sequence: 'NULL',
    Description: 'NULL'
  },
  {
    StatusId: 27,
    ShipmentStatus: 'Forwarded in Co-courier',
    Sequence: 'NULL',
    Description: 'NULL'
  },
  {
    StatusId: 28,
    ShipmentStatus: 'Party Come and Collect',
    Sequence: 'NULL',
    Description: 'NULL'
  },
  {
    StatusId: 29,
    ShipmentStatus: 'Load Arrived Late',
    Sequence: 'NULL',
    Description: 'NULL'
  },
  {
    StatusId: 30,
    ShipmentStatus: 'Under Processing',
    Sequence: 'NULL',
    Description: 'NULL'
  },
  {
    StatusId: 31,
    ShipmentStatus: 'Duty Amount Not Paid',
    Sequence: 'NULL',
    Description: 'NULL'
  },
  {
    StatusId: 32,
    ShipmentStatus: 'Import Duty Not Paid',
    Sequence: 'NULL',
    Description: 'NULL'
  },
  {
    StatusId: 33,
    ShipmentStatus: 'Connected',
    Sequence: 'NULL',
    Description: 'NULL'
  },
  {
    StatusId: 34,
    ShipmentStatus: 'Label Created in Chennai',
    Sequence: 1,
    Description: 'LABEL CREATED IN CHENNAI'
  },
  {
    StatusId: 35,
    ShipmentStatus: 'Informed to Consignee',
    Sequence: 'NULL',
    Description: 'NULL'
  },
  {
    StatusId: 36,
    ShipmentStatus: 'Security Gate Delivery',
    Sequence: 'NULL',
    Description: 'NULL'
  },
  {
    StatusId: 37,
    ShipmentStatus: 'Informed to Shipper',
    Sequence: 'NULL',
    Description: 'NULL'
  },
  {
    StatusId: 38,
    ShipmentStatus: 'Chemical Power',
    Sequence: 'NULL',
    Description: 'NULL'
  },
  {
    StatusId: 39,
    ShipmentStatus: 'Receiver Not Available',
    Sequence: 'NULL',
    Description: 1
  },
  {
    StatusId: 41,
    ShipmentStatus: 'Booking cancelled',
    Sequence: 'NULL',
    Description: 1
  },
  {
    StatusId: 42,
    ShipmentStatus: 'Door locked 3rd day',
    Sequence: 'NULL',
    Description: 'NULL'
  },
  {
    StatusId: 43,
    ShipmentStatus: 'Duty Amount to Pay',
    Sequence: 'NULL',
    Description: 'Duty Amount to Pay'
  },
  {
    StatusId: 44,
    ShipmentStatus: 'Party Shifted',
    Sequence: 'NULL',
    Description: 'Party Shifted'
  },
  {
    StatusId: 45,
    ShipmentStatus: 'Shipment hold',
    Sequence: 'NULL',
    Description: 'NULL'
  },
  {
    StatusId: 46,
    ShipmentStatus: 'Public Holiday',
    Sequence: 'NULL',
    Description: 'NULL'
  },
  {
    StatusId: 47,
    ShipmentStatus: 'Waiting for Clearance',
    Sequence: 'NULL',
    Description: 'waiting for clearance'
  },
  {
    StatusId: 49,
    ShipmentStatus: 'Premises Closed',
    Sequence: 'NULL',
    Description: 'Premises Closed'
  },
  {
    StatusId: 50,
    ShipmentStatus: 'RTO delivered - Shipper',
    Sequence: 'NULL',
    Description: 'RTO delivered - Shipper'
  },
  {
    StatusId: 52,
    ShipmentStatus: 'Waiting for ADC Papers',
    Sequence: 'NULL',
    Description: 'Waiting for ADC Papers'
  },
  {
    StatusId: 53,
    ShipmentStatus: 'Label Created in UPS',
    Sequence: 'NULL',
    Description: 'NULL'
  },
  {
    StatusId: 55,
    ShipmentStatus: 'Office Closed 1st Day',
    Sequence: 'NULL',
    Description: 'NULL'
  },
  {
    StatusId: 56,
    ShipmentStatus: 'Under Process For Adc',
    Sequence: 'NULL',
    Description: 'NULL'
  },
  {
    StatusId: 57,
    ShipmentStatus: 'Adc process completed',
    Sequence: 'NULL',
    Description: 'NULL'
  }
];

const statusById = new Map(courierStatus.map((entry) => [entry.StatusId, entry]));
const statusByText = new Map(courierStatus.map((entry) => [entry.ShipmentStatus, entry]));

function toStatusLookupKey(value: string) {
  return value.trim().toLowerCase().replace(/[^a-z0-9]+/g, ' ').replace(/\s+/g, ' ');
}

const canonicalTextByLookupKey = new Map(
  courierStatus.map((entry) => [toStatusLookupKey(entry.ShipmentStatus), entry.ShipmentStatus]),
);

const legacyStatusAliases = new Map<string, string>([
  ['reached destinatation', 'Reached Destination'],
  ['returned to orgin', 'Returned to Origin'],
  ['wrong phone not reach', 'Wrong Phone Number or Not Reachable'],
  ['wrong pincode in pack', 'Wrong Pincode in Shipment'],
  ['shipment hold', 'Shipment hold'],
  ['waiting for clearance', 'Waiting for Clearance'],
]);

export function resolveCourierStatus(value: number | string | null | undefined) {
  if (typeof value === 'number') {
    return statusById.get(value);
  }

  if (typeof value !== 'string') {
    return undefined;
  }

  const trimmedValue = value.trim();

  if (!trimmedValue) {
    return undefined;
  }

  const exactMatch = statusByText.get(trimmedValue);

  if (exactMatch) {
    return exactMatch;
  }

  const lookupKey = toStatusLookupKey(trimmedValue);
  const canonicalText = legacyStatusAliases.get(lookupKey) || canonicalTextByLookupKey.get(lookupKey);

  return canonicalText ? statusByText.get(canonicalText) : undefined;
}

export function normalizeShipmentStatusValue(value: number | string | null | undefined) {
  return resolveCourierStatus(value)?.ShipmentStatus;
}

export function getShipmentStatus(value: number | string | null | undefined, fallback = 'NA') {
  const normalizedStatus = normalizeShipmentStatusValue(value);

  if (normalizedStatus) {
    return normalizedStatus;
  }

  if (typeof value === 'string') {
    const trimmedValue = value.trim();
    return trimmedValue || fallback;
  }

  return fallback;
}

export function isSameShipmentStatus(left: number | string | null | undefined, right: number | string | null | undefined) {
  const leftStatus = resolveCourierStatus(left);
  const rightStatus = resolveCourierStatus(right);

  if (leftStatus && rightStatus) {
    return leftStatus.StatusId === rightStatus.StatusId;
  }

  if (typeof left === 'string' && typeof right === 'string') {
    return toStatusLookupKey(left) === toStatusLookupKey(right);
  }

  return left === right;
}