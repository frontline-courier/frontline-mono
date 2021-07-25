import firebase from 'firebase';
// import admin from 'firebase-admin';


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
    const bookingRef = db.collection('frontline-booking');

    const snapshot = await bookingRef.get();
    
    snapshot.forEach((doc: any) => {
      console.log(doc.id, '=>', doc.data());
    });
}

getData();

