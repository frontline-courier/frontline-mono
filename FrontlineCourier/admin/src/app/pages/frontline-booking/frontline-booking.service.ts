// import { Injectable } from '@angular/core';
// import { AngularFireAuth } from '@angular/fire/auth';
// import { AngularFirestore } from '@angular/fire/firestore';
// import { Booking } from '../../models/booking';
// import { courierDetailsBackup2 } from '../../backups/courier-details';
// import { courierStatusBackup } from '../../backups/courier-status';


// interface BookingStatus {
//     id: number,
//     statusId: number,
//     statusDate: string,
//     remark: string,
// }

// @Injectable({
//   providedIn: 'root'
// })

// export class FrontlineBookingService {

//   constructor(private afAuth: AngularFireAuth, private db: AngularFirestore) { }

//   // lookup courier list
//   async lookupCourier() {
//     return this.db.collection('frontline-courier');
//   }

//   // lookup shipment status
//   async lookupStatus() {
//     return this.db.collection('frontline-status');
//   }

//   // lookup booking list
//   async lookupBooking() {
//     return this.db.collection('frontline-booking');
//   }

//   // create a booking
//   async addBooking(formData: any) {
//     const user = await this.afAuth.currentUser;

//     console.log('data', formData);
//     const data: Booking = {
//       awbNumber: formData.awb,
//       referenceNumber: formData.referenceNumber,
//       bookedDate: formData.bookingDate,
//       shipperName: formData.shipperName,
//       origin: formData.origin,
//       receiverName: formData.receiverName,
//       destination: formData.destination,
//       courier: formData.courier,
//       doxType: formData.doxType,
//       shipmentMode: formData.shipmentMode,
//       transportMode: formData.transportMode,
//       shipmentStatus: 1,
//       remarks: formData.remarks,
//       deliveryOfficeAddress: formData.deliveryOfficeLocation,
//       additionalContacts: formData.additionalPhoneNumber,
//       additionalWeights: formData.volumetricWeightOrSize,
//       additionalLeaf: formData.leafNumber,
//       bookingAmount: formData.bookingAmount,
//       billAmount: formData.billAmount,
//       createTimestamp: new Date(),
//       createdBy: user.displayName,
//     };
//     return this.db.collection('frontline-booking').add(data).then((res) => console.log(res))
//     .catch((err) => console.log(err));
//   }

//   // create a booking
//   async populateData() {
//     const user = await this.afAuth.currentUser;

//     // for (const courier of courierDetailsBackup2) {
//     //   const data: Booking = {
//     //     id: courier.Id,
//     //     awbNumber: courier.AWBNumber.toString(),
//     //     referenceNumber: courier.ReferenceNumber.toString(),
//     //     bookedDate: courier.BookedDate,
//     //     shipperName: courier.ShipperName,
//     //     origin: courier.Origin,
//     //     receiverName: courier.ReceiverName,
//     //     destination: courier.Destination,
//     //     courier: courier.Courier,
//     //     doxType: courier.DoxType,
//     //     shipmentMode: courier.ShipmentMode,
//     //     transportMode: courier.TransportMode,
//     //     shipmentStatus: courier.ShipmentStatus,
//     //     deliveredDate: courier.DeliveredDate,
//     //     receivedPersonName: courier.ReceivedPersonName,
//     //     receivedPersonRelation: courier.ReceivedPersonRelation as string,
//     //     remarks: courier.Remarks,
//     //     deliveryOfficeAddress: courier.DeliveryOfficeAddress,
//     //     additionalContacts: courier.AdditionalContacts as string,
//     //     additionalWeights: courier.AdditionalWeights as string,
//     //     additionalLeaf: courier.AdditionalLeaf as string,
//     //     bookingAmount: parseFloat(courier.BookingAmount as string),
//     //     billAmount: parseFloat(courier.BillAmount as string),
//     //     createdBy: 'MIGRATION',
//     //   };

//     const output = new Map<number, BookingStatus[]>();
//     let bookingStatusArr: BookingStatus[] = [];

//     for (const i of courierStatusBackup) {
//         const bookingStatus: BookingStatus = {
//             id: i.id,
//             statusId: i.statusId,
//             statusDate: i.statusDate,
//             remark: i.remark as string,
//         }
    
//         bookingStatusArr.push(bookingStatus);
    
//         if (output.has(i.courierId) === false) {
//             output.set(i.courierId, bookingStatusArr)
//         }
//         else {
//             // console.log(output.get(i.CourierId))
//             bookingStatusArr.push(...output.get(i.courierId))
//             output.set(i.courierId, bookingStatusArr);
//         }
    
//         bookingStatusArr = [];
//     }

//     // for (const status of courierStatusBackup) {
//     //   const data: any = {
//     //     id: status.id,
//     //     courierId: status.courierId,
//     //     statusId: status.statusId,
//     //     statusDate: status.statusDate,
//     //     remark: status.remark,
//     //   };

//     for (const o of output) {

//         // console.log(o[0], o[1]);
//       await this.db.collection('frontline-booking').doc(o[0].toString())
//         .update({ delivery: o[1] }).then((res) => console.log('completed'))
//         .catch((err) => console.log('error'));
//     }

//   }
// }

