// import { Injectable } from '@angular/core';
// import { AngularFireAuth } from '@angular/fire/auth';
// import { AngularFirestore } from '@angular/fire/firestore';
// import { Booking } from '../../models/booking';
// import { courierDetails } from '../../backups/courier-details';
// import { courierStatus } from '../../backups/courier-status';
// import { statusMapping } from '../../backups/courier-status-mapping';

// import * as moment from 'moment';

// interface BookingStatus {
//     id: number;
//     statusId: number;
//     statusDate: string;
//     remark: string;
// }

// @Injectable({
//   providedIn: 'root'
// })

// export class FrontlineBookingService {

//   constructor(private afAuth: AngularFireAuth, private db: AngularFirestore) { }

//   // create a booking
//   // async addBooking(formData: any) {
//   //   const user = await this.afAuth.currentUser;

//   //   console.log('data', formData);
//   //   const data: Booking = {
//   //     awbNumber: formData.awb,
//   //     referenceNumber: formData.referenceNumber,
//   //     bookedDate: formData.bookingDate,
//   //     shipperName: formData.shipperName,
//   //     origin: formData.origin,
//   //     receiverName: formData.receiverName,
//   //     destination: formData.destination,
//   //     courier: formData.courier,
//   //     doxType: formData.doxType,
//   //     shipmentMode: formData.shipmentMode,
//   //     transportMode: formData.transportMode,
//   //     shipmentStatus: 1,
//   //     remarks: formData.remarks,
//   //     deliveryOfficeAddress: formData.deliveryOfficeLocation,
//   //     additionalContacts: formData.additionalPhoneNumber,
//   //     additionalWeights: formData.volumetricWeightOrSize,
//   //     additionalLeaf: formData.leafNumber,
//   //     bookingAmount: formData.bookingAmount,
//   //     billAmount: formData.billAmount,
//   //     createdDateTime: new Date(),
//   //     createdBy: user.displayName,
//   //   };
//   //   return this.db.collection('frontline-booking').add(data).then((res) => console.log(res))
//   //   .catch((err) => console.log(err));
//   // }

//   // create a booking
//   async populateData() {
//     const user = await this.afAuth.currentUser;
//     let count = 1;

//     // for (const courier of courierDetails) {
//     // //   const data: Booking = {
//     // //     id: courier.Id,
//     // //     awbNumber: courier.AWBNumber + '',
//     // //     referenceNumber: courier.ReferenceNumber === 'NULL' ? '' : courier.ReferenceNumber + '',
//     // //     bookedDate: moment(courier.BookedDate, 'DD-MM-YYYY HH:mm').toDate(),
//     // //     shipperName: courier.ShipperName as string,
//     // //     origin: courier.Origin as string,
//     // //     receiverName: courier.ReceiverName as string,
//     // //     destination: courier.Destination as string,
//     // //     courier: courier.Courier,
//     // //     doxType: courier.DoxType,
//     // //     shipmentMode: courier.ShipmentMode,
//     // //     transportMode: courier.TransportMode,
//     // //     shipmentStatus: courier.ShipmentStatus,
//     // //     deliveredDate: (courier.DeliveredDate && courier.DeliveredDate !== 'NULL') ? moment(courier.DeliveredDate, 'DD-MM-YYYY HH:mm').toDate() : null,
//     // //     receivedPersonName: courier.ReceivedPersonName  === 'NULL' ? '' : courier.ReceivedPersonName,
//     // //     receivedPersonRelation: courier.ReceivedPersonRelation,
//     // //     remarks: courier.Remarks === 'NULL' ? '' : courier.Remarks,
//     // //     deliveryOfficeAddress: courier.DeliveryOfficeAddress === 'NULL' ? '' : courier.DeliveryOfficeAddress,
//     // //     additionalContacts: courier.AdditionalContacts === 'NULL' ? '' : courier.AdditionalContacts,
//     // //     additionalWeights: courier.AdditionalWeights === 'NULL' ? '' : courier.AdditionalWeights,
//     // //     additionalLeaf: courier.AdditionalLeaf === 'NULL' ? '' : courier.AdditionalLeaf,
//     // //     bookingAmount: courier.BookingAmount !== 'NULL' ? parseFloat(courier.BookingAmount as string) : 0,
//     // //     billAmount: courier.BillAmount !== 'NULL' ? parseFloat(courier.BillAmount as string) :  0,
//     // //     createdDateTime: new Date(),
//     // //     createdBy: 'MIGRATION',
//     // //   };

//     //   if (parseInt(courier.Id, 10) < 5617)
//     //       {
//     //         await this.db.collection('frontline-booking').doc(courier.Id.toString()).delete()
//     //               .then(() => console.log('delete'));
//     //       }
//     //       else {
    

//     //   await this.db.collection('frontline-booking').doc(courier.Id.toString())
//     //     .get().toPromise().then(async (res) => {
//     //       let data = res.data();
//     //       data.id = count;
          
//     //         await this.db.collection('frontline-booking').doc(count.toString())
//     //           .set(data)
//     //           .then(async () => {
//     //             await this.db.collection('frontline-booking').doc(courier.Id.toString()).delete()
//     //               .then(() => console.log('success'));
//     //           })

//     //     })
//     //     .catch((err) => console.log('get error'));
//     //                 count ++;

//     //       }
//     // }
//     const output = new Map<number, BookingStatus[]>();
//     let bookingStatusArr: BookingStatus[] = [];

//     for (const i of courierStatus) {
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

//     // for (const status of courierStatus) {
//     //   const data: any = {
//     //     id: status.id,
//     //     courierId: status.courierId,
//     //     statusId: status.statusId,
//     //     statusDate: status.statusDate,
//     //     remark: status.remark,
//     //   };
//     // }

//     for (const o of output) {
        
//         if (o[0] < 5617)
//         {
//             console.log('continue');
//             continue;
//         }
//         const mappedId = this.getMapping(o[0]);
//         // console.log(o[0], o[1]);
//       await this.db.collection('frontline-booking').doc(mappedId.toString())
//         .update({ delivery: o[1] }).then((res) => console.log('completed'))
//         .catch((err) => console.log('error'));
//     }

//   }

//   getMapping(id: number): number {
//       return statusMapping.find((x) => x.Id === id).MappingId;
//   }
// }
