import 'dart:async';
import 'dart:convert';

import 'package:bluetooth_low_energy/bluetooth_low_energy.dart';
import 'package:flutter/material.dart';
import 'package:flutter_foreground_task/flutter_foreground_task.dart';
import 'package:flutter_reactive_ble/flutter_reactive_ble.dart';
import 'package:quickmark_mobile/components/advertise_buttons.dart';
import 'package:quickmark_mobile/scan_buttons.dart';
import 'package:shared_preferences/shared_preferences.dart';

// I put a main here for faster debugging. Didn't want to go through redirects or change other pages.
// "flutter run" won't work. 
void main() {
  // Initialize port for communication between TaskHandler and UI.
  // TODO: Call this in the actual main function.
  FlutterForegroundTask.initCommunicationPort();
  runApp(const ExampleApp());
}

@pragma('vm:entry-point')
void startAdvertisementCallback() {
  print('DEBUG: Inside startCallback');
  FlutterForegroundTask.setTaskHandler(AdvertisementHandler());
}

@pragma('vm:entry-point')
void startScanCallback() {
  print('DEBUG: Inside startCallback');
  FlutterForegroundTask.setTaskHandler(ScanHandler());
}

// This is used for teacher side
class AdvertisementHandler extends TaskHandler {

  bool isDestroyed = false;
  late PeripheralManager pm;
  late Advertisement advData;

  // This is called once when session starts.
  @override
  Future<void> onStart(DateTime timestamp, TaskStarter starter) async {
    print('DEBUG: onStart()');
    pm = PeripheralManager();

    // Grab advertisement data from storage
    SharedPreferences prefs = await SharedPreferences.getInstance();
    final dataString = prefs.getString('advertisement_data');
    if (dataString != null) {
      final advertisementData = jsonDecode(dataString);
      advData = Advertisement(
        name : advertisementData['name'],
        serviceUUIDs: [
          UUID.fromString(advertisementData['UUID']),
        ]
      );
    }

    // Manually call onRepeatEvent to start the first instance instantly.
    // Initial delay is handled in _startService method 
    onRepeatEvent(timestamp);
  }

  @override
  Future<void> onRepeatEvent(DateTime timestamp) async {

    print('DEBUG: onRepeatEvent()');
    // TODO: Make incrementCount API call
    await pm.startAdvertising(advData);
    FlutterForegroundTask.sendDataToMain(1);  // sendDataToMain execute _onReceiveTaskData method in main thread
    await Future.delayed(const Duration(seconds: 20));
    await pm.stopAdvertising();

    // Get out if task is destroyed
    if(isDestroyed) return;
    FlutterForegroundTask.sendDataToMain(2);

    // Update notification content.
    FlutterForegroundTask.updateService(
      notificationTitle: 'In between advertising...',
      notificationText: 'Tap to return to the app',
    );
  }

  // When stop button is clicked
  @override
  Future<void> onDestroy(DateTime timestamp) async {
    print('DEBUG: onDestroy()');
    isDestroyed = true;
    FlutterForegroundTask.sendDataToMain(0);
  }
}

// This is used for student side.
class ScanHandler extends TaskHandler {

  late FlutterReactiveBle scanManager;
  late String targetUUID;
  
  @override
  Future<void> onStart(DateTime timestamp, TaskStarter starter) async {
    print('DEBUG: onStart()');

    // Grab advertisement data from storage
    SharedPreferences prefs = await SharedPreferences.getInstance();
    final dataString = prefs.getString('advertisement_data');
    if (dataString != null) {
      final advertisementData = jsonDecode(dataString);
      targetUUID = advertisementData['UUID'];
    }

    scanManager = FlutterReactiveBle();

    // First scan
    onRepeatEvent(timestamp);
  }

  @override
  Future<void> onRepeatEvent(DateTime timestamp) async {
    print('DEBUG: onRepeatEvent()');
    bool hasMarked = false;
    
    StreamSubscription<DiscoveredDevice> scanStream = scanManager.scanForDevices(withServices: [Uuid.parse(targetUUID)]).listen((device) {
      print('DEBUG: Inside scanStream. hasMarked: $hasMarked, name: ${device.name}, uuid: ${device.serviceUuids.last}');
      if (!hasMarked) {
        hasMarked = true;
        FlutterForegroundTask.sendDataToMain(device.name);
      }
    });
    await Future.delayed(const Duration(seconds: 20));
    scanStream.cancel();

  }

  @override
  Future<void> onDestroy(DateTime timestamp) async {
    print('DEBUG: onDestroy()');
    FlutterForegroundTask.sendDataToMain(false);
  }
}

/// ******************************************************************************** ///
// This part is just for calling the buttons. Delete later

class ExampleApp extends StatelessWidget {
  const ExampleApp({super.key});

  @override
  Widget build(BuildContext context) {
    return const MaterialApp(
      home: ExamplePage(),
    );
  }
}

class ExamplePage extends StatefulWidget {
  const ExamplePage({super.key});

  @override
  State<ExamplePage> createState() => _ExamplePageState();
}

class _ExamplePageState extends State<ExamplePage> {
  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text('Test bar'),
      ),
      // DEBUG: Change this to test different sides.
      body: const ScanButtons(),
    );
  }
}