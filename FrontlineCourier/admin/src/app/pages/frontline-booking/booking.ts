export interface Booking {
    id?: string;
    awbNumber: string;
    referenceNumber: string;
    bookedDate: string;
    shipperName?: string;
    origin?: string;
    receiverName?: string;
    destination: string;
    courier: string;
    doxType: 'Dox' | 'NonDox' | 'NA';
    shipmentMode: 'Domestic' | 'International' | 'Local' | 'NA';
    transportMode: 'Air' | 'Air Cargo' | 'Sea Cargo' | 'Surface Cargo' | 'Surface' | 'Train Surface' | 'Road Surface' | 'NA';
    shipmentStatus: string;
    deliveredDate?: string;
    receivedPersonName?: string;
    receivedPersonRelation?: string;
    remarks?: string;
    deliveryOfficeAddress?: string;
    additionalContacts?: string;
    additionalWeights?: string;
    additionalLeaf?: string;
    bookingAmount?: number;
    billAmount?: number;
    createTimestamp?: string;
    createdBy?: string;
    updatedTimestamp?: string;
    updatedBy?: string;
}
