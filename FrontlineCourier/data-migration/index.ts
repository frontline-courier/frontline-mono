import firebase from 'firebase';
// import admin from 'firebase-admin';
import { MongoClient } from 'mongodb';

const uri = "mongodb+srv://frontlineapp:SNveY2tiKp3NqfJ@frontline.tsxyg.mongodb.net/myFirstDatabase?retryWrites=true&w=majority";

const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
} as any);


var app = firebase.initializeApp({
  apiKey: 'AIzaSyBM65EL-d5ppnBlGOZ5MYoMKVDtb0z-lKI',
  authDomain: 'varun-enterprises.firebaseapp.com',
  databaseURL: 'https://varun-enterprises.firebaseio.com',
  projectId: 'varun-enterprises',
  storageBucket: 'varun-enterprises.appspot.com',
  messagingSenderId: '627419010873',
  appId: '1:627419010873:web:054515e9f51513b160bae8',
  measurementId: 'G-QPTMSCRH73',
});


const db = app.firestore();

async function getData() {
  try {
    const mongoDB = await client.connect();
    const collection = mongoDB.db('frontline-booking').collection('bookings');
    const snapshot = await db.collection('frontline-booking').orderBy('bookedDate', 'asc').get();

    snapshot.docs.map(async (doc, index) => {
      console.log(index);
      // update timestamp to date
      const data = doc.data();
      data.updatedDateTime = data.updatedDateTime?.toDate();
      data.bookedDate = data.bookedDate?.toDate();
      data.createdDateTime = data.createdDateTime?.toDate();

      data.delivery?.forEach((element: any) => {
        element.updatedDateTime = element?.updatedDateTime?.toDate();
      });

      const inserted = await collection.insertOne(data);
      console.log(inserted);
    })
  } catch (err) {
    console.log(err);
  }


  return;
}

getData();

