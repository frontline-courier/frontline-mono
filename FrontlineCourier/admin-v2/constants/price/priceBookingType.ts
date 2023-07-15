export interface PriceBookingType {
    [key: string]: {
        shipmentTypes: ShipmentTypeKeys[]
        couriers: CourierListsKeys[],
        shipmentModes: shipmentModesKeys[],
        fov: string,
        insurance?: string,
    };
}

enum ShipmentTypes {
    'DOCUMENT',
    'PARCEL'
}

type ShipmentTypeKeys = keyof typeof ShipmentTypes

enum CourierList {
    'DTDC' ,'BLUEDART','FRANCH','ST','XPRESSBEE','DELIVERY','AMAZON','ECOM','EKART','TIRUPATHI','OTHER','MARUTHI','CRITICALOG','OXYZGEN','GATI','SMARTR','DTDC  TDD','BLUEDART TDD', 'PROFESIONAL', 'FRONTLINE'
}

type CourierListsKeys = keyof typeof CourierList

enum shipmentModes {
    'AIR COURIER','AIR PARCEL','SURFACE COURIER','SURFACE PARCEL','SAFETY PLUS','BDD - DP','CITY LOCAL','REGINAL PLUS','ZONAL PLUS','METRO PLUS','NATIONAL','SPL DESTINATION','ROI -A','ROI -B','PEC PEP', 'AIR PRIORITY','SURFACE PRIORITY','AIR SPEED', 'SURFACE SPEED','ST PRIORITY', 'CARGO NORMAL' , 'CARGO ECONOMY', 'BD 10.30 & 12.00','DT 12 PM' ,'DT 2 PM','DT 4 PM', 'TPC PRO MOILE', 'TPC PRO PASSPORT','TPC PRO','PLUS PEP','AIR APEX 40.30 PM','AIR APEX 5.30 PM','SURFACELINE 4.30 PM','SURFACELINE 6.30 PM','CRETICAL EXPRESS 6.15 PM','TDD 10.30 & 12.00 ','DP EXPRESS 6.15 PM','SMARTR DP DOCUMENTS','SMARTR APEX PARCEL','SMARTR SURFACE','SAME DAY','NEXT DAY','TDD FCC 12.00','HOLIDAY'
}

export type shipmentModesKeys = keyof typeof shipmentModes
