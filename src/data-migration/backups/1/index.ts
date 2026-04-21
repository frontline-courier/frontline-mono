import firebase from 'firebase';
// import admin from 'firebase-admin';
// import { MongoClient } from 'mongodb';
import { json2csv } from 'json-2-csv';
import fs from 'fs';
import dotenv from 'dotenv';

dotenv.config();

const getRequiredEnv = (key: string): string => {
  const value = process.env[key];
  if (!value) {
    throw new Error(`Missing required environment variable: ${key}`);
  }
  return value;
};

// const uri = getRequiredEnv('MONGODB_URI');

// const client = new MongoClient(uri, {
//   useNewUrlParser: true,
//   useUnifiedTopology: true,
// } as any);

import { courierLists } from '../../../client/src/app/constants/courier-list';
import { courierStatus } from '../../../client/src/app/constants/courier-status';
import moment from 'moment';
// import { statusRelation } from './../client/src/app/constants/status-relation';

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
  return shipment + '';
}


export enum TransportMode {
  Air = 'Air',
  Cargo = 'Cargo',
  AirCargo = 'Air Cargo',
  SeaCargo = 'Sea Cargo',
  SurfaceCargo = 'Surface Cargo',
  Surface = 'Surface',
  TrainSurface = 'TrainSurface',
  RoadSurface = 'RoadSurface',
  NA = 'NA',
}

export function getTransportMode(shipment: number): string {
  switch (shipment) {
    case 1:
      return TransportMode.Air.toString();
    case 2:
      return TransportMode.Cargo.toString();
    case 3:
      return TransportMode.AirCargo.toString();
    case 4:
      return TransportMode.SeaCargo.toString();
    case 5:
      return TransportMode.SurfaceCargo.toString();
    case 6:
      return TransportMode.Surface.toString();
    case 7:
      return TransportMode.TrainSurface.toString();
    case 8:
      return TransportMode.RoadSurface.toString();
    case 9:
      return TransportMode.NA.toString();
    default:
      return shipment + ''
  }
}

export enum DoxType {
  Dox = 'Dox',
  NonDox = 'Non Dox',
  NA = 'NA',
}

export function getDoxType(dox: number): string {
  if (dox === 1) {
    return DoxType.Dox.toString();
  }
  if (dox === 2) {
    return DoxType.NonDox.toString();
  }
  if (dox === 0) {
    return DoxType.NA.toString();
  }
  return dox + '';
}


const getShipmentStatus = (status: string): string => {
  if (typeof status === 'string') { return status; }
  return courierStatus.find((s) => s.StatusId === parseInt(status, 10))?.ShipmentStatus || 'NA';
}

const getCourierName = (courierId: string): string => {
  if (courierId === null || courierId === undefined) { return 'NA'; }
  return courierLists.find((c) => c.CourierId === parseInt(courierId, 10))?.Courier || 'NA';
}

var app = firebase.initializeApp({
  apiKey: getRequiredEnv('FIREBASE_API_KEY'),
  authDomain: getRequiredEnv('FIREBASE_AUTH_DOMAIN'),
  databaseURL: getRequiredEnv('FIREBASE_DATABASE_URL'),
  projectId: getRequiredEnv('FIREBASE_PROJECT_ID'),
  storageBucket: getRequiredEnv('FIREBASE_STORAGE_BUCKET'),
  messagingSenderId: getRequiredEnv('FIREBASE_MESSAGING_SENDER_ID'),
  appId: getRequiredEnv('FIREBASE_APP_ID'),
  measurementId: getRequiredEnv('FIREBASE_MEASUREMENT_ID'),
});


const db = app.firestore();

async function getData() {
  try {
    // const mongoDB = await client.connect();
    // const collection = mongoDB.db('frontline-booking').collection('bookings');
    const snapshot = await db.collection('frontline-booking').orderBy('bookedDate', 'desc').get();

    snapshot.docs.map(async (doc, index) => {
      // console.log(index);
      // update timestamp to date
      const data = doc.data();
      data.updatedDateTime = data.updatedDateTime?.toDate().toISOString();
      data.bookedDate = data.bookedDate?.toDate().toISOString();
      data.createdDateTime = data.createdDateTime?.toDate().toISOString();

      data.delivery?.forEach((element: any) => {
        element.updatedDateTime = element?.updatedDateTime?.toDate();
      });

      // enum to data
      data.courier = getCourierName(data.courier);
      data.doxType = getDoxType(data.doxType);
      data.shipmentMode = getTransportMode(data.shipmentMode);
      data.transportMode = getShipmentMode(data.shipmentMode);
      data.coCourier = data.coCourier ? 'Yes' : 'No';

      // const inserted = await collection.insertOne(data);
      // console.log(inserted);

      // construct data
      const json = `\n${data.bookedDate},${data.awbNumber},${data.referenceNumber},${data.additionalLeaf},${data.courier},${data.shipperName},${data.origin},${data.receiverName},${data.destination},${data.doxType},${data.shipmentMode},${data.transportMode},${data.coCourier},${data.bookingAmount},${data.billAmount},${data.actualWeight},${data.shipmentStatus}`;

      fs.appendFileSync('./backup.csv', json);

    })
  } catch (err) {
    console.log(err);
  }


  return;
}

getData();

