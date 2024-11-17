import 'dart:async';

import 'package:bluetooth_low_energy/bluetooth_low_energy.dart';
import 'package:flutter/material.dart';
import 'package:flutter_foreground_task/flutter_foreground_task.dart';
import 'package:flutter_reactive_ble/flutter_reactive_ble.dart';

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
    final uuid = await FlutterForegroundTask.getData(key: 'uuid');
    try {
      if (uuid == null) {
        throw Exception('uuid not found in local storage');
      }
      advData = Advertisement(
        serviceUUIDs: [
          UUID.fromString(uuid),
        ]
      );
      await FlutterForegroundTask.removeData(key: 'uuid');
    } catch (err) {
      debugPrint('Error: $err');
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

    // Grab uuid from storage
    targetUUID = await FlutterForegroundTask.getData(key: 'uuid');
    FlutterForegroundTask.removeData(key: 'uuid');
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
      }
    });
    await Future.delayed(const Duration(seconds: 20));
    scanStream.cancel();

    // 1 = Present, 0 = Absent
    if (hasMarked) {
      FlutterForegroundTask.sendDataToMain(1);
    }
    else {
      FlutterForegroundTask.sendDataToMain(0); // TODO: Change back to 0 after testing
    }
  }

  @override
  Future<void> onDestroy(DateTime timestamp) async {
    print('DEBUG: onDestroy()');
    FlutterForegroundTask.sendDataToMain(false);
  }
}