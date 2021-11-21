"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const firebase_1 = __importDefault(require("firebase"));
const mongodb_1 = require("mongodb");
const uri = "mongodb+srv://frontlineapp:SNveY2tiKp3NqfJ@frontline.tsxyg.mongodb.net/myFirstDatabase?retryWrites=true&w=majority";
const client = new mongodb_1.MongoClient(uri, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
});
var app = firebase_1.default.initializeApp({
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
            var _a, _b, _c, _d;
            console.log(index);
            // update timestamp to date
            const data = doc.data();
            data.updatedDateTime = (_a = data.updatedDateTime) === null || _a === void 0 ? void 0 : _a.toDate();
            data.bookedDate = (_b = data.bookedDate) === null || _b === void 0 ? void 0 : _b.toDate();
            data.createdDateTime = (_c = data.createdDateTime) === null || _c === void 0 ? void 0 : _c.toDate();
            (_d = data.delivery) === null || _d === void 0 ? void 0 : _d.forEach((element) => {
                var _a;
                element.updatedDateTime = (_a = element === null || element === void 0 ? void 0 : element.updatedDateTime) === null || _a === void 0 ? void 0 : _a.toDate();
            });
            const inserted = await collection.insertOne(data);
            console.log(inserted);
        });
    }
    catch (err) {
        console.log(err);
    }
    return;
}
getData();
