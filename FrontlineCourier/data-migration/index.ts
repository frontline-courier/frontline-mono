import firebase from 'firebase';
// import admin from 'firebase-admin';
import { createClient } from '@supabase/supabase-js'
const supabase = createClient("https://drdvwswjjmmsgjqbihqg.supabase.co", "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJyb2xlIjoiYW5vbiIsImlhdCI6MTYzMDE1NjY5MCwiZXhwIjoxOTQ1NzMyNjkwfQ.M6CkDfBqIwz7nS2pwcgOozbY56Zow721GlBR36-wGQk")


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
    
    snapshot.forEach(async (doc: any) => {
      console.log(doc.id, '=>', doc.data());

      let prodData = doc.data();

      const { data, error } = await supabase
        .from('cities')
        .insert([
          { name: 'The Shire', country_id: 554 }
        ])
    });
}

getData();

