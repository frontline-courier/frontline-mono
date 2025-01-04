"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getDoxType = exports.DoxType = exports.getTransportMode = exports.TransportMode = exports.getShipmentMode = exports.ShipmentMode = void 0;
const firebase_1 = __importDefault(require("firebase"));
const fs_1 = __importDefault(require("fs"));
// const uri = "mongodb+srv://frontlineapp:SNveY2tiKp3NqfJ@frontline.tsxyg.mongodb.net/myFirstDatabase?retryWrites=true&w=majority";
// const client = new MongoClient(uri, {
//   useNewUrlParser: true,
//   useUnifiedTopology: true,
// } as any);
const courier_list_1 = require("./../client/src/app/constants/courier-list");
const courier_status_1 = require("./../client/src/app/constants/courier-status");
// import { statusRelation } from './../client/src/app/constants/status-relation';
var ShipmentMode;
(function (ShipmentMode) {
    ShipmentMode["Domestic"] = "Domestic";
    ShipmentMode["International"] = "International";
    ShipmentMode["Local"] = "Local";
    ShipmentMode["NA"] = "NA";
})(ShipmentMode = exports.ShipmentMode || (exports.ShipmentMode = {}));
function getShipmentMode(shipment) {
    if (shipment === 1) {
        return ShipmentMode.Domestic.toString();
    }
    else if (shipment === 2) {
        return ShipmentMode.International.toString();
    }
    else if (shipment === 3) {
        return ShipmentMode.Local.toString();
    }
    else if (shipment === 0) {
        return ShipmentMode.NA.toString();
    }
    return shipment + '';
}
exports.getShipmentMode = getShipmentMode;
var TransportMode;
(function (TransportMode) {
    TransportMode["Air"] = "Air";
    TransportMode["Cargo"] = "Cargo";
    TransportMode["AirCargo"] = "Air Cargo";
    TransportMode["SeaCargo"] = "Sea Cargo";
    TransportMode["SurfaceCargo"] = "Surface Cargo";
    TransportMode["Surface"] = "Surface";
    TransportMode["TrainSurface"] = "TrainSurface";
    TransportMode["RoadSurface"] = "RoadSurface";
    TransportMode["NA"] = "NA";
})(TransportMode = exports.TransportMode || (exports.TransportMode = {}));
function getTransportMode(shipment) {
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
            return shipment + '';
    }
}
exports.getTransportMode = getTransportMode;
var DoxType;
(function (DoxType) {
    DoxType["Dox"] = "Dox";
    DoxType["NonDox"] = "Non Dox";
    DoxType["NA"] = "NA";
})(DoxType = exports.DoxType || (exports.DoxType = {}));
function getDoxType(dox) {
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
exports.getDoxType = getDoxType;
const getShipmentStatus = (status) => {
    var _a;
    if (typeof status === 'string') {
        return status;
    }
    return ((_a = courier_status_1.courierStatus.find((s) => s.StatusId === parseInt(status, 10))) === null || _a === void 0 ? void 0 : _a.ShipmentStatus) || 'NA';
};
const getCourierName = (courierId) => {
    var _a;
    if (courierId === null || courierId === undefined) {
        return 'NA';
    }
    return ((_a = courier_list_1.courierLists.find((c) => c.CourierId === parseInt(courierId, 10))) === null || _a === void 0 ? void 0 : _a.Courier) || 'NA';
};
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
        // const mongoDB = await client.connect();
        // const collection = mongoDB.db('frontline-booking').collection('bookings');
        const snapshot = await db.collection('frontline-booking').orderBy('bookedDate', 'desc').get();
        snapshot.docs.map(async (doc, index) => {
            var _a, _b, _c, _d;
            // console.log(index);
            // update timestamp to date
            const data = doc.data();
            data.updatedDateTime = (_a = data.updatedDateTime) === null || _a === void 0 ? void 0 : _a.toDate().toISOString();
            data.bookedDate = (_b = data.bookedDate) === null || _b === void 0 ? void 0 : _b.toDate().toISOString();
            data.createdDateTime = (_c = data.createdDateTime) === null || _c === void 0 ? void 0 : _c.toDate().toISOString();
            (_d = data.delivery) === null || _d === void 0 ? void 0 : _d.forEach((element) => {
                var _a;
                element.updatedDateTime = (_a = element === null || element === void 0 ? void 0 : element.updatedDateTime) === null || _a === void 0 ? void 0 : _a.toDate();
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
            fs_1.default.appendFileSync('./backup.csv', json);
        });
    }
    catch (err) {
        console.log(err);
    }
    return;
}
getData();
