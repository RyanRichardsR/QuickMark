// ignore_for_file: deprecated_member_use

import 'dart:async';

import 'package:flutter/material.dart';
import 'package:flutter_blue_plus/flutter_blue_plus.dart';
import 'package:permission_handler/permission_handler.dart';
import 'package:workmanager/workmanager.dart';

String deviceName = "Unknown Device";
String targetUUID = "32145678-1234-5678-1234-56789abcdef0";
int successfulScans = 0;
int interval = 10;

void callbackDispatcher() {
  Workmanager().executeTask((task, inputData) async {
    // Request necessary permissions
    if (await Permission.bluetoothScan.isGranted && await Permission.location.isGranted) {
      // Start scanning for Bluetooth devices
      FlutterBluePlus.startScan(timeout: Duration(seconds: 3), withServices: [Guid(targetUUID)]);

      // Listen for scan results
      FlutterBluePlus.scanResults.listen((scanResults) {
        for (var result in scanResults) {
          if (result.advertisementData.serviceUuids.contains(Guid(targetUUID))) {
            deviceName = result.device.name;
            successfulScans++;
          }
          }
        
      });
    }
    // Schedule the next task after 10 seconds
    Workmanager().registerOneOffTask(
      'bluetoothScanTask',
      'scanForDevices',
      initialDelay: Duration(seconds: interval),
    );

    // Return true to indicate task execution completed successfully
    return Future.value(true);
  });
}

class MyHomePage extends StatefulWidget {
  final String title;

  const MyHomePage({super.key, required this.title});

  @override
  _MyHomePageState createState() => _MyHomePageState();
}

class _MyHomePageState extends State<MyHomePage> {
  bool isRunning = false;

  @override
  initState(){
    super.initState();
    // Initialize Workmanager to handle background tasks
    Workmanager().initialize(callbackDispatcher, isInDebugMode: true);
    
  }

  void startBluetoothScan() {
    Workmanager().registerOneOffTask(
      'bluetoothScanTask', // Unique name for the task
      'scanForDevices',
    );
    setState(() {
      isRunning = true;
    });
  }

  void stopBluetoothScan() {
    Workmanager().cancelAll();
    setState(() {
      isRunning = false;
    });
    // Display the total number of successful scans
    showDialog(
      context: context,
      builder: (context) => AlertDialog(
        title: Text('Scanning Stopped'),
        content: Text('Total successful scans: $successfulScans'),
        actions: [
          TextButton(
            onPressed: () => Navigator.of(context).pop(),
            child: Text('OK'),
          ),
        ],
      ),
    );
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: Text(widget.title),
      ),
      body: Center(
        child: Column(
          mainAxisAlignment: MainAxisAlignment.center,
          children: [
            Text('Device Name: $deviceName'),
            Text('UUID: $targetUUID'),
            Text('Successful scans: $successfulScans'),
            SizedBox(height: 20),
            isRunning
                ? ElevatedButton(
                    onPressed: stopBluetoothScan,
                    child: Text('Stop Scanning'),
                  )
                : ElevatedButton(
                    onPressed: startBluetoothScan,
                    child: Text('Start Scanning'),
                  ),
          ],
        ),
      ),
    );
  }
}
