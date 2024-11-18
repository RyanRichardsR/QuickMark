import 'dart:io';

import 'package:flutter/material.dart';
import 'package:flutter_foreground_task/flutter_foreground_task.dart';
import 'package:permission_handler/permission_handler.dart';
import 'package:quickmark_mobile/components/ble_handlers.dart';
import 'package:quickmark_mobile/server_calls.dart';

//Color Pallete Constants
const white = Color(0xFFF7FCFF) ;
const lightBlue = Color(0xFF8DA9C4) ;
const blue = Color(0xFF134074) ;
const darkBlue = Color(0xFF13315C) ;
const navy = Color(0xFF0B2545) ;

class ScanButtons extends StatefulWidget {

  final Map<String, dynamic> attendReq;

  const ScanButtons({super.key, required this.attendReq});
  @override
  State<ScanButtons> createState() => _ScanButtonsState();
}

class _ScanButtonsState extends State<ScanButtons> {

  late Map<String, dynamic> sessionInfo;
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
      sessionInfo = await mobileSessionApiCall();
      _initService();
    });
  }

  @override
  void dispose() {
    // Remove a callback to receive data sent from the TaskHandler.
    FlutterForegroundTask.removeTaskDataCallback(_onReceiveTaskData);
    FlutterForegroundTask.stopService();
    super.dispose();
  }

  // API call for getting session info
  Future<Map<String, dynamic>> mobileSessionApiCall() async {
    Map<String, dynamic> sessionInfo = {};
    final body = {
      'sessionId' : widget.attendReq['sessionId'],
    };
    try {
      var response = await ServerCalls().post('/getMobileSession', body);
      if(response['error'] != null) {
        throw Exception(response['error']);
      } else {
        sessionInfo = response;
      }
    } catch (err) {
      debugPrint('Error: $err');
    }
    return sessionInfo;
  }

  // Calculate when to scan
  Duration getNextScanDelay() {
    DateTime startTime = DateTime.parse(sessionInfo['startTime']);
    DateTime curTime = DateTime.now();
    // TODO: Fix the delay
    while (curTime.isAfter(startTime.add(const Duration(seconds:10)))) {
      startTime = startTime.add(const Duration(seconds: 30));
    }
    Duration nextScanDelay = startTime.difference(curTime);
    return nextScanDelay;
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

    if (!await Permission.location.status.isGranted) {
      await Permission.location.request();
    }

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
        eventAction: ForegroundTaskEventAction.repeat(30000),
        allowWakeLock: true,
      ),
    );
  }

  // This method starts the service. onStart method runs "immediately"
  Future<ServiceRequestResult> _startService() async {

    //Initial delay and uuid set up
    setState(() {
      isScanning = true;
      statusStr = 'Scanning';
    });
    FlutterForegroundTask.saveData(key: 'uuid', value: sessionInfo['uuid']);
    await Future.delayed(getNextScanDelay());

    if (!isScanning) {
      return ServiceRequestResult(success: false);
    }

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
  Future<ServiceRequestResult> _stopService() {
    setState(() {
      isScanning = false;
      statusStr = 'Not scanning';
    });
    return FlutterForegroundTask.stopService();
  }
  
  // This function is executed when FlutterForegroundTask.sendDataToMain(Object data) is executed in Handler
  void _onReceiveTaskData(Object data) async {

    // This is for scan status
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

    // This is for scan result
    if (data is int) {

      // studentScan api call
      final body = {
        'userId' : widget.attendReq['userId'],
        'sessionId' : widget.attendReq['sessionId'],
        'isPresent' : (data == 1) ? true : false,
      };
      try {
        var response = await ServerCalls().post('/studentScan', body);
        if(response['error'] != null) {
          throw Exception(response['error']);
        } else {
          // If session is no longer running, stop.
          if (!response['isRunning']) {
            setState(() {
              _stopService();
            });
          }
        }
      } catch (err) {
        debugPrint('Error: $err');
      } 
      
      setState(() {
        count++;
      });

    }
  }

  // Modify this to change the look of buttons
  @override
  Widget build(BuildContext context) {
    return SizedBox(
      height: 180,
      child: Center(
        child: Column(
          children: [
            Row(
              mainAxisAlignment: MainAxisAlignment.center,
              children: [
                ElevatedButton(
                  onPressed: (isScanning) ? _stopService : _startService,
                  style: ElevatedButton.styleFrom(
                    backgroundColor: isScanning ? Colors.red : Colors.green,
                    elevation: 5,
                    fixedSize: Size(320, 70),
                    shape: RoundedRectangleBorder(
                      borderRadius: BorderRadius.circular(5),
                    ),
                  ),
                  child: Text(
                    isScanning ? 'Leave Session' : 'Join Session', 
                    style: const TextStyle(color: Colors.white)
                  ),
                ),
              ],
            ),
          ],
        ),
      ),
    );
  }
}