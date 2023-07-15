import { shipmentModesKeys } from './priceBookingType';

export interface DomesticZoneType {
    zone: string,
    shipmentMode: shipmentModesKeys[],
}