import zoneJson from '../zone.json';

export const PINCODE_TO_ZONE_MAP = new Map(zoneJson.map(zone => [zone.pin, zone.zone]));

export const ZONE_TO_PINCODE_MAP = new Map(zoneJson.map(zone => [zone.zone, zone.pin]));
