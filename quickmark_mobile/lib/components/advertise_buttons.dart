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

class AdvertiseButtons extends StatefulWidget {

  final String classId;

  const AdvertiseButtons({super.key, required this.classId});
  @override
  State<AdvertiseButtons> createState() => _AdvertiseButtonsState();
}

class _AdvertiseButtonsState extends State<AdvertiseButtons> {

  /* Ble status
   *  0 - Not advertising
   *  1 - Advertising
   *  2 - In between advertising
   *  3 - Advertising starting soon
   * -1 - Error
   */ 
  int status = 0;
  String statusStr = 'Not advertising';
  int count = 0;
  dynamic sessionId;

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

  // Update status information
  void _updateStatus(int newStatus) {
    switch (newStatus) {
        case 0:
          statusStr = 'Not advertising';
        case 1:
          statusStr = 'Advertising';
        case 2:
          statusStr = 'In between advertising';
        case 3:
          statusStr = 'Advertisement starting soon';
        case -1:
          statusStr = 'Error!';
    }
    setState(() {
      status = newStatus;
    });
  }

  Future<void> _requestPermissions() async {
    final NotificationPermission notificationPermission =
      await FlutterForegroundTask.checkNotificationPermission();
    if (notificationPermission != NotificationPermission.granted) {
      await FlutterForegroundTask.requestNotificationPermission();
    }

    if (!await Permission.bluetoothAdvertise.status.isGranted) {
      await Permission.bluetoothAdvertise.request();
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
        channelId: 'ble_advertisement',
        channelName: 'Ble Advertisement Notification',
        channelDescription: 'This notification appears when ble is being advertised.',
        onlyAlertOnce: true,
      ),
      iosNotificationOptions: const IOSNotificationOptions(
        showNotification: true,
      ),
      foregroundTaskOptions: ForegroundTaskOptions(
        // TODO: Change interval value
        eventAction: ForegroundTaskEventAction.repeat(30000),
        allowWakeLock: true,
      ),
    );
  }

  // This method starts the service. onStart method runs "immediately"
  Future<ServiceRequestResult> _startService() async {
    
    // TODO: Generate a random uuid
    const String uuid = '32145678-1234-5678-1234-56789abcdef0';

    // Prepare data for api call
    final body = {
      'uuid' : uuid,
      'startTime' : DateTime.now().toIso8601String(),
      'classId' : widget.classId,
    };

    
    // Create session api call
    try {
      var response = await ServerCalls().post('/createSession', body);
      if(response['error'] != '') {
        setState((){ //Creates the error message
          statusStr = response['error'];
        });
      } else { // Store the newly created session id
        sessionId = response['newSession']['_id'];
        debugPrint('Session created. sessionId: $sessionId');
      }
    } catch (err) {
      debugPrint('Error: $err');
    }
    

    // Store uuid locally for use in handler
    FlutterForegroundTask.saveData(key: 'uuid', value: uuid);

    // Initial delay
    // TODO: Change this value
    count = 0;
    _updateStatus(3);
    await Future.delayed(const Duration(seconds: 10));

    if (await FlutterForegroundTask.isRunningService) {
      return FlutterForegroundTask.restartService();
    }
    else {
      return FlutterForegroundTask.startService(
        serviceId: 256,
        notificationTitle: 'Advertising Bluetooth',
        notificationText: 'Tap to return to the app',
        callback: startAdvertisementCallback,
      );
    }
  }

  // Stop service and potentially do things
  Future<ServiceRequestResult> _stopService() async {

    // End session api call
    final body = {
      'sessionId' : sessionId,
      'endTime' : DateTime.now().toIso8601String(),
    };
    try {
      var response = await ServerCalls().post('/endSession', body);
      if(response['error'] != null) {
        debugPrint('Error: ${response['error']}');
      } else {
        debugPrint(response['message']);
      }
    } catch (err) {
      debugPrint('Error: $err');
    }    

    return FlutterForegroundTask.stopService();
  }
  
  // This function is executed when FlutterForegroundTask.sendDataToMain(Object data) is executed in Handler
  void _onReceiveTaskData(Object data) async {

    // TODO: Potentially customize data type as Lists or something
    // to differentiate between datatypes such as status or scan results
    if (data is int) {
      // Update count for each advertisement start
      if (data == 1) {
        
        // incrementTeacherSignals api call
        final body = {
          'sessionId' : sessionId,
        };
        try {
          var response = await ServerCalls().post('/incrementTeacherSignals', body);
          if(response['error'] != null) {
            debugPrint('Error: ${response['error']}');
          } else {
            debugPrint(response['message']);
          }
        } catch (err) {
          debugPrint('Error: $err');
        }        

        setState(() {
          count++;
        });
      }
      _updateStatus(data);
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
                  onPressed: (status == 1 || status == 2 || status == 3) ? null : () {
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
                  child: const Text('Start Session', style: TextStyle(color: Colors.white)),
                ),
                ElevatedButton(
                  onPressed: (status == 0 || status == 3) ? null : () {
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
                  child: const Text('End Session', style: TextStyle(color: Colors.white)),
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