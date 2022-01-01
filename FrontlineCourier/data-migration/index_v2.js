"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getDoxType = exports.DoxType = exports.getTransportMode = exports.TransportMode = exports.getShipmentMode = exports.ShipmentMode = void 0;
const mongodb_1 = require("mongodb");
const uri = "mongodb+srv://frontlineapp:AiOolcPeHzCN5dLx@frontline.tsxyg.mongodb.net/myFirstDatabase?retryWrites=true&w=majority";
const client = new mongodb_1.MongoClient(uri, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
});
const courier_list_1 = require("../client/src/app/constants/courier-list");
const courier_status_1 = require("../client/src/app/constants/courier-status");
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
        collection.rename('booking-bk-2019');
    }
    catch (err) {
        console.log(err);
    }
    return;
}
getData();
