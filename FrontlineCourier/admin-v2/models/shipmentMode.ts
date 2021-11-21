export enum ShipmentMode {
    Domestic = 'Domestic',
    International = 'International',
    Local = 'Local',
    NA = 'NA',
}

export function getShipmentMode(shipment: number): string {
    if (shipment === 1) {
        return ShipmentMode.Domestic.toString();
    } else if (shipment === 2) {
        return ShipmentMode.International.toString();
    } else if (shipment === 3) {
        return ShipmentMode.Local.toString();
    } else if (shipment === 0) {
        return ShipmentMode.NA.toString();
    }
    return 'NA';
}
