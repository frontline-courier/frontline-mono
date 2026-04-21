import { Collection, MongoClient, ObjectId } from 'mongodb';
import dotenv from 'dotenv';

dotenv.config();

const getRequiredEnv = (key: string): string => {
  const value = process.env[key];
  if (!value) {
    throw new Error(`Missing required environment variable: ${key}`);
  }
  return value;
};

const uri = getRequiredEnv('MONGODB_URI');

const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
} as any);



async function getData() {
  try {
    const mongoDB = await client.connect();
    const collection = mongoDB.db('frontline-booking').collection('bookings');

    const backupCollection = mongoDB.db('frontline-booking').collection('booking-bk-2022_date_fix');

    // Take Backup
    await collection.find()
      .forEach((d) => {
        backupCollection.insertOne(d);
      })

    const docs = collection.find();

    docs.forEach((doc: any) => {
      // If the item is null then the cursor is exhausted/empty and closed
      if(doc == null) {
          mongoDB.close(); // you may not want to close the DB if you have more code....
          return;
      }
      // otherwise, do something with the item
      console.log(doc.bookedDate);
      // collection.updateOne({ _id: new ObjectId(doc._id) }, { $set: { bookedDate: new Date(doc.bookedDate) } })
  });


  } catch (err) {
    console.log(err);
  }


  return;
}

getData();

