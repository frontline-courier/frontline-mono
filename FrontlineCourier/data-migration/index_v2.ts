import { Collection, MongoClient } from 'mongodb';
import { json2csv } from 'json-2-csv';
import fs from 'fs';

const uri = "mongodb+srv://frontlineapp:xxx@frontline.tsxyg.mongodb.net/myFirstDatabase?retryWrites=true&w=majority";

const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
} as any);

import { courierLists } from '../client/src/app/constants/courier-list';
import { courierStatus } from '../client/src/app/constants/courier-status';
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


async function getData() {
  try {
    const mongoDB = await client.connect();
    const collection = mongoDB.db('frontline-booking').collection('booking-bk-dec-31-2022');
    const backupCollection = mongoDB.db('frontline-booking').collection('booking-bk-2020');

    // Take Backup
    // await collection.find({ bookedDate: { $lte : new Date("2021-01-01T00:00:01Z") } })
    //   .forEach((d) => {
    //     backupCollection.insertOne(d);
    //   })

    // // Drop from main collection
    // await collection.deleteMany({ bookedDate: { $lte : new Date("2021-01-01T00:00:01Z") } })

    // collection rename
    collection.rename('booking-bk-2019')

  } catch (err) {
    console.log(err);
  }


  return;
}

getData();

