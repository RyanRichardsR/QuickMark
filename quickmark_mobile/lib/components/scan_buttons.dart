import 'dart:convert';
import 'dart:io';

import 'package:flutter/material.dart';
import 'package:flutter_foreground_task/flutter_foreground_task.dart';
import 'package:permission_handler/permission_handler.dart';
import 'package:quickmark_mobile/components/ble_handlers.dart';
import 'package:quickmark_mobile/server_calls.dart';
import 'package:shared_preferences/shared_preferences.dart';

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
    debugPrint("DEBUG: attendReq = ${widget.attendReq}");

    WidgetsBinding.instance.addPostFrameCallback((_) async {
      await _requestPermissions();
      sessionInfo = await sessionInfoApiCall();
      _initService();
    });
  }

  @override
  void dispose() {
    // Remove a callback to receive data sent from the TaskHandler.
    FlutterForegroundTask.removeTaskDataCallback(_onReceiveTaskData);
    super.dispose();
  }

  // API call for getting session info
  Future<Map<String, dynamic>> sessionInfoApiCall() async {
    Map<String, dynamic> sessionInfo = {'error' : 'Failed to load session'};
    final body = {
      'sessionId' : widget.attendReq['sessionId'],
    };
    try {
      debugPrint('DEBUG: body = $body');
      var response = await ServerCalls().post('/getSessionInfo', body);
      debugPrint('DEBUG: response = $response');
      if(response['error'] != null) {
        debugPrint('${response['error']}');
      } else {
      debugPrint('Session loaded. sessionId: ${response['_id']}]');
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
        eventAction: ForegroundTaskEventAction.repeat(30000),
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

    //Initial delay and uuid set up
    setState(() {
      isScanning = true;
      statusStr = 'Scanning';
    });
    FlutterForegroundTask.saveData(key: 'uuid', value: sessionInfo['uuid']);
    await Future.delayed(getNextScanDelay());

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
  void _onReceiveTaskData(Object data) async {

    // TODO: Potentially customize data type as Lists or something
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
      debugPrint("DEBUG: body result = $body");
      try {
        var response = await ServerCalls().post('/studentScan', body);
        if(response['error'] != null) {
          debugPrint('Error: ${response['error']}');
        } else {
          debugPrint(response['message']);

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
    return Container(
      padding: const EdgeInsets.all(16.0),
      height: 180,
      child: Center(
        child: Column(
          children: [
            Row(
              mainAxisAlignment: MainAxisAlignment.spaceBetween,
              children: [
                ElevatedButton(
                  onPressed: (isScanning) ? null : () {
                    _startService();
                  },
                  style: ElevatedButton.styleFrom(
                    backgroundColor: blue,
                    fixedSize: const Size(140, 100),
                    elevation: 10,
                    shape: RoundedRectangleBorder(
                      borderRadius: BorderRadius.circular(10),
                    ),
                  ),
                  child: const Text('Join Session', style: TextStyle(color: Colors.white)),
                ),
                ElevatedButton(
                  onPressed: (!isScanning) ? null : () {
                    _stopService();
                  },
                  style: ElevatedButton.styleFrom(
                    backgroundColor: blue,
                    fixedSize: const Size(140, 100),
                    elevation: 10,
                    shape: RoundedRectangleBorder(
                      borderRadius: BorderRadius.circular(10),
                    ),
                  ),
                  child: const Text('Leave Session', style: TextStyle(color: Colors.white)),
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