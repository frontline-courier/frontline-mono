import { PriceBookingType } from './priceBookingType';

const pricingBooking: PriceBookingType[] = [
    {
        'COURIER NORMAL': {
            shipmentTypes: [
                'DOCUMENT',
                'PARCEL'
            ],
            couriers: [
                'DTDC', 'BLUEDART', 'FRANCH', 'ST', 'XPRESSBEE', 'DELIVERY', 'AMAZON', 'ECOM', 'EKART', 'TIRUPATHI', 'OTHER', 'MARUTHI', 'CRITICALOG'
            ],
            shipmentModes: [
                'AIR COURIER', 'AIR PARCEL', 'SURFACE COURIER', 'SURFACE PARCEL'
            ],
            fov: '0.20% + 18% GST or 60rs min'
        },
    },
    {
        'COURIER EXPRESS': {
            shipmentTypes: [
                'DOCUMENT',
                'PARCEL'
            ],
            couriers: [
                'DTDC','BLUEDART','FRANCH'
            ],
            shipmentModes: [
                'SAFETY PLUS','BDD - DP','CITY LOCAL','REGINAL PLUS','ZONAL PLUS','METRO PLUS','NATIONAL','SPL DESTINATION','ROI -A','ROI -B','PEC PEP'
            ],
            fov: '0.20% + 18% GST or 60rs min'
        },
    },
    {
        'COURIER PRIORITY': {
            shipmentTypes: [
                'DOCUMENT',
                'PARCEL'
            ],
            couriers: [
                'DTDC' ,'TIRUPATHI' ,'ST'
            ],
            shipmentModes: [
                'AIR PRIORITY','SURFACE PRIORITY','AIR SPEED', 'SURFACE SPEED','ST PRIORITY'
            ],
            fov: '0.20% + 18% GST or 60rs min'
        },
    },
    {
        CARGO: {
            shipmentTypes: [
                'PARCEL'
            ],
            couriers: [
                'BLUEDART','DTDC','XPRESSBEE','DELIVERY','OXYZGEN','GATI','SMARTR'
            ],
            shipmentModes: [
                'CARGO NORMAL' , 'CARGO ECONOMY'
            ],
            fov: '0.20% + 18% GST or 60rs min',
            insurance: '3%  or MIN 100rs',
        },
    },
    {
        'COURIER TDD': {
            shipmentTypes: [
                'DOCUMENT', 'PARCEL'
            ],
            couriers: [
                'DTDC  TDD','BLUEDART TDD'
            ],
            shipmentModes: [
                'BD 10.30 & 12.00','DT 12 PM' ,'DT 2 PM','DT 4 PM'
            ],
            fov: '0.20% + 18% GST or 60rs min',
            insurance: '3%  or MIN 100rs',
        },
    },
    {
        'COURIER LAKE BOOKING': {
            shipmentTypes: [
                'DOCUMENT', 'PARCEL'
            ],
            couriers: [
                'DTDC' ,'BLUEDART','FRANCH','ST','XPRESSBEE','DELIVERY','TIRUPATHI','OTHER','MARUTHI','CRITICALOG','PROFESIONAL'
            ],
            shipmentModes: [
                'TPC PRO MOILE', 'TPC PRO PASSPORT','TPC PRO','AIR PRIORITY','SURFACE PRIORITY','ST PRIORITY','SAFETY PLUS','BDD - DP','CITY LOCAL','REGINAL PLUS','ZONAL PLUS','METRO PLUS','NATIONAL','SPL DESTINATION','ROI -A','ROI -B','PEC PEP','AIR COURIER','AIR PARCEL','SURFACE COURIER','SURFACE PARCEL','PLUS PEP','PEC PEP','AIR APEX 40.30 PM','AIR APEX 5.30 PM','SURFACELINE 4.30 PM','SURFACELINE 6.30 PM','CRETICAL EXPRESS 6.15 PM','TDD 10.30 & 12.00 ','DP EXPRESS 6.15 PM','SMARTR DP DOCUMENTS','SMARTR APEX PARCEL','SMARTR SURFACE','ST PRIORITY' 
            ],
            fov: '0.20% + 18% GST or 60rs min',
        },
    },
    {
        'COURIER TOPAY & COD': {
            shipmentTypes: [
                 'PARCEL'
            ],
            couriers: [
                'DTDC' ,'BLUEDART','FRANCH','ST','XPRESSBEE','DELIVERY','AMAZON','ECOM','EKART' ,'OTHER','MARUTHI','CRITICALOG'
            ],
            shipmentModes: [
                'AIR COURIER','AIR PARCEL','SURFACE COURIER','SURFACE PARCEL'
            ],
            fov: '0.20% + 18% GST or 60rs min',
        },
    },
    {
        'COURIER MOBILE & LAPTOP': {
            shipmentTypes: [
                 'PARCEL'
            ],
            couriers: [
                'DTDC' ,'BLUEDART','FRANCH'
            ],
            shipmentModes: [
                'SAFETY PLUS','BDD - DP','CITY LOCAL','REGINAL PLUS','ZONAL PLUS','METRO PLUS','NATIONAL','SPL DESTINATION','ROI -A','ROI -B','PEC PEP'
            ],
            fov: '0.20% + 18% GST or 60rs min',
        },
    },
    {
        'COURIER PASSPORT SERVICE': {
            shipmentTypes: [
                 'PARCEL'
            ],
            couriers: [
                'DTDC' ,'BLUEDART','FRANCH'
            ],
            shipmentModes: [
                'SAFETY PLUS','BDD - DP','CITY LOCAL','REGINAL PLUS','ZONAL PLUS','METRO PLUS','NATIONAL','SPL DESTINATION','ROI -A','ROI -B','PEC PEP'
            ],
            fov: '0.20% + 18% GST or 60rs min',
        },
    },
    {
        'SPECIAL BOOKING': {
            shipmentTypes: [
                 'PARCEL', 'DOCUMENT'
            ],
            couriers: [
                'FRONTLINE'
            ],
            shipmentModes: [
                'SAME DAY','NEXT DAY','TDD FCC 12.00','HOLIDAY'
            ],
            fov: '0.20% + 18% GST or 60rs min',
        },
    },
];

