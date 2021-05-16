import 'package:firebase_core/firebase_core.dart';
import 'package:flutter/material.dart';
import 'package:frontline_courier/track.dart';

void main() {
  WidgetsFlutterBinding.ensureInitialized();
  runApp(MyApp());
}

class MyApp extends StatelessWidget {
  // This widget is the root of your application.

  final Future<FirebaseApp> _initialization = Firebase.initializeApp();
  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      title: 'Flutter Demo',
      theme: ThemeData(
        primarySwatch: Colors.green,
      ),
      home: Scaffold(
        body: SafeArea(
          child: Padding(
            padding: EdgeInsets.all(10.0),
            child: FutureBuilder(
              // Initialize FlutterFire:
              future: _initialization,
              builder: (context, snapshot) {
                // Check for errors
                if (snapshot.hasError) {
                  return Center(child: Text('Something went wrong!'));
                }

                if (snapshot.connectionState == ConnectionState.done) {
                  // return TrackScreen(title: 'Flutter Demo Home Page');
                  return TrackScreen();
                }

                // Otherwise, show something whilst waiting for initialization to complete
                return Center(child: CircularProgressIndicator());
              },
            ),
          ),
        ),
      ),
    );
  }
}
