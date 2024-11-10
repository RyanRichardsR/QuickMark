import 'dart:convert';
import 'dart:io';

import 'package:flutter/material.dart';
import 'package:flutter_foreground_task/flutter_foreground_task.dart';
import 'package:permission_handler/permission_handler.dart';
import 'package:quickmark_mobile/components/ble_handlers.dart';
import 'package:shared_preferences/shared_preferences.dart';

class ScanButtons extends StatefulWidget {
  const ScanButtons({super.key});
  @override
  State<ScanButtons> createState() => _ScanButtonsState();
}

class _ScanButtonsState extends State<ScanButtons> {

  bool isScanning = false;
  String statusStr = 'Not scanning';
  int count = 0;

  @override
  void initState() {
    super.initState();
    // To allow foreground thread to send data back to main thread
    FlutterForegroundTask.addTaskDataCallback(_onReceiveTaskData);

    WidgetsBinding.instance.addPostFrameCallback((_) async {
      await _requestPermissions();
      _initService();
    });
  }

  @override
  void dispose() {
    // Remove a callback to receive data sent from the TaskHandler.
    FlutterForegroundTask.removeTaskDataCallback(_onReceiveTaskData);
    super.dispose();
  }

  Future<void> _requestPermissions() async {
    final NotificationPermission notificationPermission =
      await FlutterForegroundTask.checkNotificationPermission();
    if (notificationPermission != NotificationPermission.granted) {
      await FlutterForegroundTask.requestNotificationPermission();
    }

    if (!await Permission.bluetoothScan.status.isGranted) {
      await Permission.bluetoothScan.request();
    }

    if (!await Permission.bluetoothConnect.status.isGranted) {
      await Permission.bluetoothConnect.request();
    }

    // TODO: Check if location is necessary

    if (Platform.isAndroid) {
      if (!await FlutterForegroundTask.isIgnoringBatteryOptimizations) {
        await FlutterForegroundTask.requestIgnoreBatteryOptimization();
      }
    }
  }

  // Set up task structure 
  void _initService() {
    FlutterForegroundTask.init(
      androidNotificationOptions: AndroidNotificationOptions(
        channelId: 'ble_scan',
        channelName: 'Ble Scan Notification',
        channelDescription: 'This notification appears when ble is being scanning.',
        onlyAlertOnce: true,
      ),
      iosNotificationOptions: const IOSNotificationOptions(
        showNotification: true,
      ),
      foregroundTaskOptions: ForegroundTaskOptions(
        eventAction: ForegroundTaskEventAction.repeat(900000),
        allowWakeLock: true,
      ),
    );
  }
  // TZM: Continue converting code from here.

  // This method starts the service. onStart method runs "immediately"
  Future<ServiceRequestResult> _startService() async {
    
    // Prepare advertisement data for scanning
    // TODO: Link with API
    final prefs = await SharedPreferences.getInstance();
    prefs.setString(
      'advertisement_data', jsonEncode({
        'name' : 'COP4331',
        'UUID' : '32145678-1234-5678-1234-56789abcdef0'
      })
    );

    // Initial delay
    // TODO: Connect with API to get next advertisement time
    // TODO: Call createSession API
    setState(() {
      isScanning = true;
      statusStr = 'Scanning';
    });
    await Future.delayed(const Duration(seconds: 10));



    if (await FlutterForegroundTask.isRunningService) {
      return FlutterForegroundTask.restartService();
    }
    else {
      return FlutterForegroundTask.startService(
        serviceId: 255,
        notificationTitle: 'Scanning Bluetooth',
        notificationText: 'Tap to return to the app',
        callback: startScanCallback,
      );
    }
  }

  // Stop service and potentially do things
  Future<ServiceRequestResult> _stopService() async {
    
    // TODO: Call endSession API
    return FlutterForegroundTask.stopService();
  }
  
  // This function is executed when FlutterForegroundTask.sendDataToMain(Object data) is executed in Handler
  void _onReceiveTaskData(Object data) {

    // TODO: Potentially customize data type as Lists or something
    // to differentiate between datatypes such as status or scan results
    if (data is bool) {
      setState(() {
        isScanning = data;
      });
      if (data == true) {
        statusStr = 'Scanning';
      }
      else {
        statusStr = 'Not scanning';
      }
    }

    if (data is String) {
      setState(() {
        count++;
      });
    }
  }

  // Modify this to change the look of buttons
  @override
  Widget build(BuildContext context) {
    return Container(
      padding: const EdgeInsets.all(16.0),
      height: 150,
      child: Center(
        child: Column(
          children: [
            Row(
              mainAxisAlignment: MainAxisAlignment.spaceEvenly,
              children: [
                ElevatedButton(
                  onPressed: (isScanning) ? null : () {
                    _startService();
                  },
                  child: const Text('Attend Class'),
                ),
                ElevatedButton(
                  onPressed: (!isScanning) ? null : () {
                    _stopService();
                  },
                  child: const Text('End Attendence'),
                ),
              ],
            ),
            const SizedBox(height: 20,),
            Row(
              mainAxisAlignment: MainAxisAlignment.spaceEvenly,
              children: [
                Text(statusStr),
                Text('count: $count'),
              ]
            )
          ],
        ),
      ),
    );
  }
}