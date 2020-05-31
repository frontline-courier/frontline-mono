import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { AngularFirestore } from '@angular/fire/firestore';
import { Booking } from './booking';  

@Injectable({
  providedIn: 'root'
})
export class FrontlineBookingService {

  constructor(private afAuth: AngularFireAuth, private db: AngularFirestore) { }

  // lookup courier list
  async lookupCourier() {
    return this.db.collection('frontline-courier');
  }

  // lookup shipment status
  async lookupStatus() {
    return this.db.collection('frontline-status');
  }

  // lookup booking list
  async lookupBooking() {
    return this.db.collection('frontline-booking');
  }

  // create a booking
  async addBooking(formData: any) {
    const user = await this.afAuth.currentUser;

    console.log('data', formData);
    const data: Booking = {
      awbNumber: formData.awb,
      referenceNumber: formData.referenceNumber,
      bookedDate: formData.bookingDate,
      shipperName: formData.shipperName,
      origin: formData.origin,
      receiverName: formData.receiverName,
      destination: formData.destination,
      courier: formData.courier,
      doxType: formData.doxType,
      shipmentMode: formData.shipmentMode,
      transportMode: formData.transportMode,
      shipmentStatus: 1,
      remarks: formData.remarks,
      deliveryOfficeAddress: formData.deliveryOfficeLocation,
      additionalContacts: formData.additionalPhoneNumber,
      additionalWeights: formData.volumetricWeightOrSize,
      additionalLeaf: formData.leafNumber,
      bookingAmount: formData.bookingAmount,
      billAmount: formData.billAmount,
      createTimestamp: new Date(),
      createdBy: user.displayName,
    };
    return this.db.collection('frontline-booking').add(data).then((res) => console.log(res))
    .catch((err) => console.log(err));
  }

  // create a booking
  async populateData() {
    const user = await this.afAuth.currentUser;

    for (const courier of courierStatus) {
      const data: any = {
        statusId: courier.StatusId,
        shipmentStatus: courier.ShipmentStatus,
        sequence: courier.Sequence,
        description: courier.Description,
      };

      // this.db.collection('frontline-status').doc(courier.StatusId.toString()).set(data).then((res) => console.log(res))
      // .catch((err) => console.log(err));
    }

  }
}


const couriers = [
  {
    CourierId: 1,
    Courier: 'DTDC Normal',
    Description: 'Normal / Express domestic / Normal International',
    Track: 'www.dtdc.com',
    Status: 1
  },
  {
    CourierId: 2,
    Courier: 'FEDEX Express',
    Description: 'Priority International',
    Track: 'www.fedex.com',
    Status: 1
  },
  {
    CourierId: 3,
    Courier: 'DHL Express',
    Description: 'Express International',
    Track: 'http://www.dhl.com/en.html',
    Status: 'NULL'
  },
  {
    CourierId: 5,
    Courier: 'FRONTLINE Normal',
    Description: 'Normal courier / Same day',
    Track: 'http://www.frontlinecourier.com',
    Status: 1
  },
  {
    CourierId: 6,
    Courier: 'SKYKING Normal',
    Description: 'Normal courier',
    Track: 'www.skyking.co',
    Status: 1
  },
  {
    CourierId: 7,
    Courier: 'UPS Priority',
    Description: 'Priority International',
    Track: 'www.ups.com/in',
    Status: 1
  },
  {
    CourierId: 8,
    Courier: 'TNT Priority',
    Description: 'Priority International',
    Track: 'www.tnt.com/express/en_in/site/home.html',
    Status: 1
  },
  {
    CourierId: 9,
    Courier: 'ARAMEX Priority',
    Description: 'Normal courier',
    Track: 'www.aramex.com',
    Status: 1
  },
  {
    CourierId: 10,
    Courier: 'NETWORK Normal',
    Description: 'www.networkcourier.com.sg',
    Track: 'www.networkcourier.com.sg',
    Status: 1
  },
  {
    CourierId: 11,
    Courier: 'DPEX Normal',
    Description: 'Normal International',
    Track: 'www.dpex.com',
    Status: 1
  },
  {
    CourierId: 12,
    Courier: 'FRANCH  Normal',
    Description: 'Normal courier',
    Track: 'www.franchexpress.com',
    Status: 1
  },
  {
    CourierId: 13,
    Courier: 'BlueDart DP  Express',
    Description: 'Express Domestic',
    Track: 'www.bluedart.com',
    Status: 1
  },
  {
    CourierId: 14,
    Courier: 'TCI EXPRESS',
    Description: 'Normal / Express cargo ( air / surface)',
    Track: 'www.tciexpress.in',
    Status: 1
  },
  {
    CourierId: 15,
    Courier: 'GATI',
    Description: 'Normal / Express cargo ( air / surface)',
    Track: 'www.gati.com',
    Status: 1
  },
  {
    CourierId: 16,
    Courier: 'FIRST FLIGHT  Normal',
    Description: 'Normal courier',
    Track: 'www.firstflight.net',
    Status: 1
  },
  {
    CourierId: 17,
    Courier: 'ST Normal',
    Description: 'Normal courier',
    Track: 'www.stcourier.com',
    Status: 1
  },
  {
    CourierId: 18,
    Courier: 'LINEX',
    Description: 'Normal International',
    Track: 'http://www.linexsolutions.com/',
    Status: 1
  },
  {
    CourierId: 19,
    Courier: 'PROFESSIONAL Normal',
    Description: 'Normal / Express domestic      Normal International',
    Track: 'http://www.tpcindia.com',
    Status: 1
  },
  {
    CourierId: 20,
    Courier: 'OVERNITE Normal',
    Description: 'Normal courier',
    Track: 'http://www.overnitenet.com/',
    Status: 'NULL'
  },
  {
    CourierId: 21,
    Courier: 'BlueDart TDD 10.30 / 12.00',
    Description: 'Morning delivery 10.30 / 12.00',
    Track: 'www.bluedart.com',
    Status: 'NULL'
  },
  {
    CourierId: 22,
    Courier: 'BlueDart Critical',
    Description: 'Passport  / Critical shipments',
    Track: 'www.bluedart.com',
    Status: 1
  },
  {
    CourierId: 23,
    Courier: 'BlueDart Apex',
    Description: 'Air mode only',
    Track: 'www.bluedart.com',
    Status: 'NULL'
  },
  {
    CourierId: 24,
    Courier: 'BlueDart Surfaceline',
    Description: 'Surface mode only',
    Track: 'www.bluedart.com',
    Status: 'NULL'
  },
  {
    CourierId: 27,
    Courier: 'FEDEX Priority Domestic',
    Description: 'Priority / Economy mode domestic',
    Track: 'www.fedex.com',
    Status: 'NULL'
  },
  {
    CourierId: 28,
    Courier: 'SHREE MAHAVIR Normal',
    Description: 'Normal courier',
    Track: 'http://www.shreemahavircourier.com/',
    Status: 1
  },
  {
    CourierId: 29,
    Courier: 'MADHUR COURIER',
    Description: 'Normal courier',
    Track: 'http://www.madhurcouriers.in',
    Status: 'NULL'
  },
  {
    CourierId: 30,
    Courier: 'ARAMEX Normal',
    Description: 'Normal International',
    Track: 'www.aramex.com',
    Status: 'NULL'
  },
  {
    CourierId: 31,
    Courier: 'Under processing',
    Description: 'Under processing',
    Track: 'Under processing',
    Status: 'NULL'
  },
  {
    CourierId: 32,
    Courier: 'TRACKON Normal',
    Description: 'NULL',
    Track: 'www.trackoncourier.com',
    Status: 'NULL'
  },
  {
    CourierId: 33,
    Courier: 'CO COURIER',
    Description: 'NULL',
    Track: 'NULL',
    Status: 'NULL'
  },
  {
    CourierId: 34,
    Courier: 'ONDOT Normal',
    Description: 'NULL',
    Track: 'www.ondot.co',
    Status: 'NULL'
  },
  {
    CourierId: 35,
    Courier: 'FRONTLINE Priority',
    Description: 'NULL',
    Track: 'http://www.frontlinecourier.com',
    Status: 'NULL'
  },
  {
    CourierId: 36,
    Courier: 'SHREE NANDHAN Normal',
    Description: 'NULL',
    Track: 'http://www.shreenandancourier.com',
    Status: 'NULL'
  },
  {
    CourierId: 37,
    Courier: 'ANIJANI Normal',
    Description: 'NULL',
    Track: 'http://www.shreeanjanicourier.com',
    Status: 'NULL'
  },
  {
    CourierId: 38,
    Courier: 'OVERNITE Priority',
    Description: 'NULL',
    Track: 'http://www.overnitenet.com/',
    Status: 'NULL'
  },
  {
    CourierId: 39,
    Courier: 'MORNING 9.00 to 11.00',
    Description: 'NULL',
    Track: 'http://www.frontlinecourier.com',
    Status: 'NULL'
  },
  {
    CourierId: 40,
    Courier: 'MORNING 9.00 to 12.30',
    Description: 'NULL',
    Track: 'http://www.frontlinecourier.com',
    Status: 'NULL'
  },
  {
    CourierId: 41,
    Courier: 'DTDC Priority',
    Description: 'NULL',
    Track: 'www.dtdc.in',
    Status: 'NULL'
  },
  {
    CourierId: 42,
    Courier: 'DTDC PTP 12.00',
    Description: 'NULL',
    Track: 'www.dtdc.in',
    Status: 'NULL'
  },
  {
    CourierId: 43,
    Courier: 'DTDC PTP 14.00',
    Description: 'NULL',
    Track: 'www.dtdc.in',
    Status: 'NULL'
  },
  {
    CourierId: 45,
    Courier: 'DTDC Sunday',
    Description: 'NULL',
    Track: 'www.dtdc.in',
    Status: 'NULL'
  },
  {
    CourierId: 46,
    Courier: 'FRANCH Safty Plus',
    Description: 'NULL',
    Track: 'www.franchexpress.com',
    Status: 'NULL'
  },
  {
    CourierId: 47,
    Courier: 'TOTAL Normal',
    Description: 'NULL',
    Track: 'NULL',
    Status: 'NULL'
  },
  {
    CourierId: 49,
    Courier: 'PROFESSINAL Priority',
    Description: 'NULL',
    Track: 'http://www.tpcindia.com',
    Status: 'NULL'
  },
  {
    CourierId: 50,
    Courier: 'ELITEAIRBORNE Normal',
    Description: 'NULL',
    Track: 'https://www.eliteairborne.com',
    Status: 1
  },
  {
    CourierId: 51,
    Courier: 'BDHL EXPRESS',
    Description: 'NULL',
    Track: 'http://www.dhl.com/en.html',
    Status: 'NULL'
  },
  {
    CourierId: 52,
    Courier: 'OVERNITE mobile',
    Description: 'NULL',
    Track: 'http://www.overnitenet.com/',
    Status: 'NULL'
  },
  {
    CourierId: 53,
    Courier: 'OVERNITE Passport',
    Description: 'NULL',
    Track: 'http://www.overnitenet.com/',
    Status: 'NULL'
  },
  {
    CourierId: 54,
    Courier: 'PRIME TRACK Priority',
    Description: 'NULL',
    Track: 'http://www.primetrack.in/',
    Status: 'NULL'
  },
  {
    CourierId: 55,
    Courier: 'SHREE MAHAVIR Priority',
    Description: 'NULL',
    Track: 'http://www.shreemahavircourier.com/',
    Status: 'NULL'
  },
  {
    CourierId: 56,
    Courier: 'SPOTON Logistics',
    Description: 'NULL',
    Track: 'www.spoton.co.in',
    Status: 'NULL'
  },
  {
    CourierId: 57,
    Courier: 'CITY LINK Normal',
    Description: 'NULL',
    Track: 'http://www.citylinkexpress.com/',
    Status: 'NULL'
  },
  {
    CourierId: 58,
    Courier: 'ST Priority',
    Description: 'NULL',
    Track: 'www.stcourier.com',
    Status: 'NULL'
  },
  {
    CourierId: 59,
    Courier: 'DHL Economy',
    Description: 'NULL',
    Track: 'http://www.dhl.com/en.html',
    Status: 'NULL'
  },
  {
    CourierId: 60,
    Courier: 'BlueDart - Apex - Fr',
    Description: 'NULL',
    Track: 'www.bluedart.com',
    Status: 'NULL'
  },
  {
    CourierId: 61,
    Courier: 'YOUNGKNIGHT Normal',
    Description: 'NULL',
    Track: 'https://youngknightexpress.com/in/tracking',
    Status: 'NULL'
  },
  {
    CourierId: 62,
    Courier: 'SHREE TIRUPATHI Normal',
    Description: 'NULL',
    Track: 'http://shreetirupaticourier.net/',
    Status: 'NULL'
  },
  {
    CourierId: 63,
    Courier: 'BlueDart Apex Economy',
    Description: 'NULL',
    Track: 'www.bluedart.com',
    Status: 'NULL'
  },
  {
    CourierId: 64,
    Courier: 'Frontline Priority 2.00 Pm',
    Description: 'NULL',
    Track: 'NULL',
    Status: 'NULL'
  },
  {
    CourierId: 65,
    Courier: 'FEDEX Normal Road',
    Description: 'NULL',
    Track: 'www.fedex.co.in',
    Status: 'NULL'
  },
  {
    CourierId: 66,
    Courier: 'FEDEX Economy Domestic',
    Description: 'NULL',
    Track: 'www.fedex.co.in',
    Status: 'NULL'
  },
  {
    CourierId: 67,
    Courier: 'Speed & Safe Courier',
    Description: 'NULL',
    Track: 'http://www.speedandsafe.com',
    Status: 'NULL'
  },
  {
    CourierId: 68,
    Courier: 'Atlantic International Courier',
    Description: 'NULL',
    Track: 'https://atlanticcourier.net',
    Status: 'NULL'
  },
  {
    CourierId: 69,
    Courier: 'Frontline Sunday Express',
    Description: 'NULL',
    Track: 'www.frontlinecourier.com',
    Status: 1
  },
  {
    CourierId: 70,
    Courier: 'FEDEX Intl Economy',
    Description: 'NULL',
    Track: 'www.fedex.com/in',
    Status: 'NULL'
  },
  {
    CourierId: 71,
    Courier: 'BDHL Priority',
    Description: 'NULL',
    Track: 'https://www.dhl.co.in/en',
    Status: 'NULL'
  },
  {
    CourierId: 72,
    Courier: 'Delhivery',
    Description: 'www.delhivery.com',
    Track: 'https://www.delhivery.com',
    Status: 'NULL'
  },
  {
    CourierId: 73,
    Courier: 'UPS Express',
    Description: 'NULL',
    Track: 'www.ups.com/in',
    Status: 1
  },
  {
    CourierId: 74,
    Courier: 'BlueDart DP Economy',
    Description: 'NULL',
    Track: 'www.bluedart.com',
    Status: 1
  },
  {
    CourierId: 75,
    Courier: 'SkyNet',
    Description: 'NULL',
    Track: 'https://www.skynetworldwide.com/',
    Status: 'NULL'
  },
  {
    CourierId: 76,
    Courier: 'BLUEDART INTL ECONOMY',
    Description: 'NULL',
    Track: 'www.bluedart.com',
    Status: 'NULL'
  },
  {
    CourierId: 77,
    Courier: 'UPS Economy',
    Description: 'NULL',
    Track: 'www.ups.com/in',
    Status: 'NULL'
  },
  {
    CourierId: 78,
    Courier: 'Delhivery - Priority',
    Description: 'NULL',
    Track: 'https://www.delhivery.com',
    Status: 'NULL'
  }
];

const courierStatus = [
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
    ShipmentStatus: 'Reached destinatation',
    Sequence: 'NULL',
    Description: 'NULL'
  },
  {
    StatusId: 7,
    ShipmentStatus: 'DELIVERED',
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
    ShipmentStatus: 'Returned  to Orgin',
    Sequence: 'NULL',
    Description: 1
  },
  {
    StatusId: 10,
    ShipmentStatus: 'Incorrect address',
    Sequence: 'NULL',
    Description: 1
  },
  {
    StatusId: 11,
    ShipmentStatus: 'Wrong phone  / Not reach',
    Sequence: 'NULL',
    Description: 1
  },
  {
    StatusId: 12,
    ShipmentStatus: 'Wrong pincode in pack',
    Sequence: 'NULL',
    Description: 1
  },
  {
    StatusId: 13,
    ShipmentStatus: 'No service area',
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
    ShipmentStatus: 'Taken for delivery',
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
    ShipmentStatus: 'LOAD LATE CUTOFF',
    Sequence: 'NULL',
    Description: 'NULL'
  },
  {
    StatusId: 21,
    ShipmentStatus: 'REFUSED TO ACCEPT',
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
    ShipmentStatus: 'Canceled By Shipper',
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
    ShipmentStatus: 'Clearance process ok',
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
    ShipmentStatus: 'FORWARDED IN CO COURIER',
    Sequence: 'NULL',
    Description: 'NULL'
  },
  {
    StatusId: 28,
    ShipmentStatus: 'PARTY COME AND COLLECT',
    Sequence: 'NULL',
    Description: 'NULL'
  },
  {
    StatusId: 29,
    ShipmentStatus: 'LOAD ARRIVED  LATE',
    Sequence: 'NULL',
    Description: 'NULL'
  },
  {
    StatusId: 30,
    ShipmentStatus: 'UNDER PROCESSING',
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
    ShipmentStatus: 'IMPORT DUTY NOT PAID',
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
    ShipmentStatus: 'LABEL CREATED IN CHENNAI',
    Sequence: 1,
    Description: 'LABEL CREATED IN CHENNAI'
  },
  {
    StatusId: 35,
    ShipmentStatus: 'INFORMED TO CONSIGNEE',
    Sequence: 'NULL',
    Description: 'NULL'
  },
  {
    StatusId: 36,
    ShipmentStatus: 'SECURITY  GATE DELIVERY',
    Sequence: 'NULL',
    Description: 'NULL'
  },
  {
    StatusId: 37,
    ShipmentStatus: 'INFORMED TO SHIPPER',
    Sequence: 'NULL',
    Description: 'NULL'
  },
  {
    StatusId: 38,
    ShipmentStatus: 'CHEMICAL  POWER',
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
    ShipmentStatus: 'Shipment  hold',
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
    ShipmentStatus: 'waiting for clearance',
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
    ShipmentStatus: 'RTO delivered  Shipper',
    Sequence: 'NULL',
    Description: 'RTO delivered  Shipper'
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
