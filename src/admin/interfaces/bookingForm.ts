import { BranchOption } from '../constants/branchOptions';
import { ImportDutyOption } from '../constants/importDutyOptions';

export type BookingFormInputs = {
    awbNumber: string,
    referenceNumber: string,
    bookedDate: string,
    courier: number,
    shipperName: string,
    origin: string,
    doxType: number,
    receiverName: string,
    destination: string,
    shipmentMode: number,
    transportMode: number,
    importDuty: ImportDutyOption | '',
    bookingAmount?: number,
    branch: BranchOption | '',
    actualWeight?: number,
    bookedBy: string,
    paymentMode: string,
    remarks: string,
    internalRemarks: string,
    deliveryOfficeLocation: string,
    additionalContacts: string,
    additionalWeights: string,
    additionalLeaf: string,
    thirdPartyNumber: string,
};
