import 'package:frontline_courier/functions/courier_list.dart';
import 'package:frontline_courier/functions/get_delivery_status.dart';
import 'package:intl/intl.dart';

import 'package:flutter/material.dart';
import 'package:timeline_tile/timeline_tile.dart';
import 'package:velocity_x/velocity_x.dart';

// Import the firebase_core and cloud_firestore plugin
import 'package:cloud_firestore/cloud_firestore.dart';

enum TrackingType { POD, RefNumber }
RegExp exp = RegExp(r'^[a-zA-Z0-9]+$');

class TrackScreen extends StatefulWidget {
  @override
  _TrackScreenState createState() => _TrackScreenState();
}

class _TrackScreenState extends State<TrackScreen> {
  final _formKey = GlobalKey<FormState>();
  TrackingType _trackingType = TrackingType.POD;
  final billNo = TextEditingController();
  List<QueryDocumentSnapshot<dynamic>> data = [];

  @override
  void dispose() {
    // Clean up the controller when the widget is disposed.
    billNo.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    CollectionReference booking =
        FirebaseFirestore.instance.collection('frontline-booking');

    return Container(
      child: ListView(
        children: [
          Row(
            children: [
              Expanded(
                child: ListTile(
                  title: const Text('POD'),
                  leading: Radio<TrackingType>(
                    value: TrackingType.POD,
                    groupValue: _trackingType,
                    onChanged: (TrackingType value) {
                      setState(() {
                        _trackingType = value;
                      });
                    },
                  ),
                ),
              ),
              Expanded(
                child: ListTile(
                  title: const Text('Reference Number'),
                  leading: Radio<TrackingType>(
                    value: TrackingType.RefNumber,
                    groupValue: _trackingType,
                    onChanged: (TrackingType value) {
                      setState(() {
                        _trackingType = value;
                      });
                    },
                  ),
                ),
              )
            ],
          ),
          HeightBox(20),
          Row(
            children: [
              Expanded(
                child: Form(
                  key: _formKey,
                  child: TextFormField(
                    controller: billNo,
                    textInputAction: TextInputAction.done,
                    keyboardType: TextInputType.text,
                    decoration: InputDecoration(
                      border: UnderlineInputBorder(),
                      labelText: 'Provide the POD or Reference Number.',
                      suffixIcon: IconButton(
                        onPressed: () => {
                          setState(() {
                            billNo.clear();
                          }),
                        },
                        icon: Icon(Icons.clear),
                      ),
                    ),
                    validator: (value) {
                      if (value == null || value.isEmpty) {
                        return 'Please enter valid POD or Reference Number';
                      }
                      if (exp.hasMatch(value) == false) {
                        return 'Allowed values are A-Z, 0-9';
                      }
                      if (value.length > 25 || value.length < 5) {
                        return 'Minimum 5 character and Maximum 24 character';
                      }
                      return null;
                    },
                  ),
                ),
              )
            ],
          ),
          HeightBox(20),
          Row(
            children: [
              Expanded(
                child: ElevatedButton(
                  onPressed: () async {
                    // Validate returns true if the form is valid, or false otherwise.
                    if (_formKey.currentState.validate()) {
                      String column = _trackingType == TrackingType.POD
                          ? 'awbNumber'
                          : 'referenceNumber';
                      QuerySnapshot<Object> snapshot = await booking
                          .where(column, isEqualTo: billNo.text)
                          .get();

                      setState(() {
                        data = snapshot.docs?.toList();

                        if (data == null || data.isEmpty) {
                          ScaffoldMessenger.of(context).showSnackBar(
                            SnackBar(
                                content: Text(
                                    'POD or Reference Number is not available, Please contact us for more information...')),
                          );
                        }

                        // if (data != null) {
                        //   print(data[0]);
                        // }
                      });
                    }
                  },
                  child: Text('Track'),
                ),
              ),
            ],
          ),
          (data.length > 0 &&
                  _formKey.currentState != null &&
                  _formKey.currentState.validate())
              ? SizedBox(
                  height: 110, // Some height
                  child: Card(
                    child: Padding(
                      padding: const EdgeInsets.all(8.0),
                      child: Row(
                        children: [
                          Expanded(
                            child: TimelineTile(
                              indicatorStyle: IndicatorStyle(
                                color: Colors.orange,
                              ),
                              isFirst: true,
                              axis: TimelineAxis.horizontal,
                              alignment: TimelineAlign.center,
                              endChild: Text(
                                DateFormat.yMMMd().format(
                                  data[0]['bookedDate'].toDate(),
                                ),
                              ),
                              startChild: Text('Booked'),
                            ),
                          ),
                          Expanded(
                            child: TimelineTile(
                              indicatorStyle: IndicatorStyle(
                                color: Colors.blue,
                              ),
                              isLast: !isDelivered(data[0]['delivery']),
                              axis: TimelineAxis.horizontal,
                              alignment: TimelineAlign.center,
                              endChild: Text(
                                DateFormat.yMMMd().format(
                                  DateTime.now(),
                                ),
                              ),
                              startChild: Text('In-Transit'),
                            ),
                          ),
                          isDelivered(data[0]['delivery'])
                              ? Expanded(
                                  child: TimelineTile(
                                    isLast: true,
                                    indicatorStyle: IndicatorStyle(
                                      color: Colors.green,
                                    ),
                                    axis: TimelineAxis.horizontal,
                                    alignment: TimelineAlign.center,
                                    endChild: Text(
                                        getDeliveryDate(data[0]['delivery'])),
                                    startChild: Text('Delivered'),
                                  ),
                                )
                              : SizedBox(),
                        ],
                      ),
                    ),
                  ),
                )
              : SizedBox(),
          (data.length > 0 &&
                  _formKey.currentState != null &&
                  _formKey.currentState.validate())
              ? Column(
                  children: [
                    HeightBox(20),
                    Row(
                      mainAxisAlignment: MainAxisAlignment.spaceBetween,
                      children: [
                        "AWB Number".text.make(),
                        data[0]['awbNumber'].toString().text.bold.make(),
                      ],
                    ),
                    HeightBox(2.5),
                    Divider(),
                    Row(
                      mainAxisAlignment: MainAxisAlignment.spaceBetween,
                      children: [
                        "Reference Number".text.make(),
                        data[0]['referenceNumber'].toString().text.bold.make(),
                      ],
                    ),
                    HeightBox(2.5),
                    Divider(),
                    Row(
                      mainAxisAlignment: MainAxisAlignment.spaceBetween,
                      children: [
                        "Booked Date".text.make(),
                        DateFormat.yMMMd()
                            .format(data[0]['bookedDate'].toDate())
                            .toString()
                            .text
                            .bold
                            .make(),
                      ],
                    ),
                    HeightBox(2.5),
                    Divider(),
                    Row(
                      mainAxisAlignment: MainAxisAlignment.spaceBetween,
                      children: [
                        "Shipper Name".text.make(),
                        data[0]['shipperName'].toString().text.bold.make(),
                      ],
                    ),
                    HeightBox(2.5),
                    Divider(),
                    Row(
                      mainAxisAlignment: MainAxisAlignment.spaceBetween,
                      children: [
                        "Origin".text.make(),
                        data[0]['origin'].toString().text.bold.make(),
                      ],
                    ),
                    HeightBox(2.5),
                    Divider(),
                    Row(
                      mainAxisAlignment: MainAxisAlignment.spaceBetween,
                      children: [
                        "Receiver Name".text.make(),
                        data[0]['receiverName'].toString().text.bold.make(),
                      ],
                    ),
                    HeightBox(2.5),
                    Divider(),
                    Row(
                      mainAxisAlignment: MainAxisAlignment.spaceBetween,
                      children: [
                        "Destination".text.make(),
                        data[0]['destination'].toString().text.bold.make(),
                      ],
                    ),
                    HeightBox(2.5),
                    Divider(),
                    // Row(
                    //   mainAxisAlignment: MainAxisAlignment.spaceBetween,
                    //   children: [
                    //     "Package Type".text.make(),
                    //     data[0]['doxType'].toString().text.bold.make(),
                    //   ],
                    // ),
                    // HeightBox(2.5),
                    // Row(
                    //   mainAxisAlignment: MainAxisAlignment.spaceBetween,
                    //   children: [
                    //     "Shipment Mode".text.make(),
                    //     data[0]['shipmentMode'].toString().text.bold.make(),
                    //   ],
                    // ),
                    // HeightBox(2.5),
                    // Row(
                    //   mainAxisAlignment: MainAxisAlignment.spaceBetween,
                    //   children: [
                    //     "Transport Mode".text.make(),
                    //     data[0]['transportMode'].toString().text.bold.make(),
                    //   ],
                    // ),
                    // HeightBox(2.5),
                    // Row(
                    //   mainAxisAlignment: MainAxisAlignment.spaceBetween,
                    //   children: [
                    //     "Received By".text.make(),
                    //     data[0]['receivedPerson'] != null
                    //         ? data[0]['receivedPerson'].toString().text.make()
                    //         : ''.text.make(),
                    //   ],
                    // ),
                    // HeightBox(2.5),
                    // Divider(),
                    Row(
                      mainAxisAlignment: MainAxisAlignment.spaceBetween,
                      children: [
                        "Relation".text.make(),
                        (data[0].data()['receivedPersonRelation'] != null &&
                                data[0]['receivedPersonRelation'] != 'NULL')
                            ? data[0]['receivedPersonRelation']
                                .toString()
                                .text
                                .bold
                                .make()
                            : '-'.text.make(),
                      ],
                    ),
                    HeightBox(2.5),
                    Divider(),
                    Row(
                      mainAxisAlignment: MainAxisAlignment.spaceBetween,
                      children: [
                        "Delivery Office Location".text.make(),
                        data[0]['deliveryOfficeAddress']
                            .toString()
                            .text
                            .maxLines(5)
                            .bold
                            .make(),
                      ],
                    ),
                    HeightBox(2.5),
                    Divider(),
                    Row(
                      mainAxisAlignment: MainAxisAlignment.spaceBetween,
                      children: [
                        "Remarks".text.make(),
                        data[0]['remarks'].toString().text.bold.make(),
                      ],
                    ),
                    HeightBox(2.5),
                    Divider(),
                    Row(
                      mainAxisAlignment: MainAxisAlignment.spaceBetween,
                      children: [
                        "Courier".text.make(),
                        getCourierName(data[0]['courier'].toString())
                            .text
                            .bold
                            .make(),
                      ],
                    ),
                    HeightBox(2.5),
                    Divider(),
                    Row(
                      mainAxisAlignment: MainAxisAlignment.spaceBetween,
                      children: [
                        "Website".text.make(),
                        getCourierWebsite(data[0]['courier'].toString())
                            .text
                            .bold
                            .make(),
                      ],
                    ),
                    HeightBox(2.5),
                    Divider(),
                  ],
                )
              : HeightBox(10),
        ],
      ),
    );
  }
}
