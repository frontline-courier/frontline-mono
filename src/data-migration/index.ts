import { Collection, MongoClient } from 'mongodb';
import { json2csv } from 'json-2-csv';
import fs from 'fs';

const uri = "mongodb+srv://frontlineapp:AiOolcPeHzCN5dLx@frontline.tsxyg.mongodb.net/myFirstDatabase?retryWrites=true&w=majority";

const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
} as any);

// TODO: change to actual api all instead of contact in next backup
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

const backupYear = 2023;

async function backupData() {

  try {
    const mongoDB = await client.connect();

    const mainCollection = mongoDB.db('frontline-booking').collection('bookings');
    const tempCollection = mongoDB.db('frontline-booking').collection(`bookings-temp-bk-${backupYear}`);
    const backupCollection = mongoDB.db('frontline-booking').collection(`booking-bk-${backupYear}`);

    // copy all collectino to backupCollection
    await tempCollection.insertMany(await mainCollection.find({}).toArray());

    // copy Data less than time
    const documentsToBackup = await tempCollection.find({ bookedDate: { $lte: new Date(`${backupYear + 1}-01-01T00:00:01Z`) } }).toArray();
    await backupCollection.insertMany(documentsToBackup);

    // delete from main collection
    // await mainCollection.deleteMany({ bookedDate: { $lte : new Date(`${backupYear + 1}-01-01T00:00:01Z`) } })

    // drop temp
    await tempCollection.drop();
    console.log(`Backup completed for year ${backupYear}.`);

  } catch (err) {
    console.log(`Backup failure for ${backupYear} - ${err}.`);
  }
  return;
}

async function dropData() {
  try {
    const mongoDB = await client.connect();
    const mainCollection = mongoDB.db('frontline-booking').collection('bookings');
    await mainCollection.deleteMany({ bookedDate: { $lte: new Date(`${backupYear + 1}-01-01T00:00:01Z`) } })
    console.log(`Drop completed for year ${backupYear}.`);
  } catch (err) {
    console.log(`Drop completed for year ${backupYear}.`);
  }
}

async function downloadData(...years: number[]) {
  const mongoDB = await client.connect();
  const collection = mongoDB.db('frontline-booking');

  try {
    for (let year of years) {
      const backupCollection = collection.collection(`booking-bk-${year}`);
      const documents = await backupCollection.find().toArray();

      const csvData = documents.map(doc => {
        // Create a new object excluding fields that are arrays
        const filteredDoc = Object.fromEntries(
          Object.entries(doc).filter(([key, value]) => !Array.isArray(value))
        );

        // Convert the filtered document to a CSV string
        return Object.values(filteredDoc).join(',');
      });

      // Write to CSV file
      fs.appendFileSync(`./backup_${year}.csv`, csvData.join('\n') + '\n');
      console.log(`Data for year ${year} written to backup_${year}.csv`);
    }
  } catch (err) {
    console.error(`Error downloading data: ${err}`);
  } finally {
    await client.close();
  }
}

(async () => {
  // await backupData();
  // await dropData();
  await downloadData(2020, 2021, 2022, 2023);
})();
