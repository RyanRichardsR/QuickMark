import 'dart:io';

import 'package:flutter/material.dart';
import 'package:flutter_foreground_task/flutter_foreground_task.dart';
import 'package:permission_handler/permission_handler.dart';
import 'package:quickmark_mobile/components/advertise_buttons.dart';
import 'package:quickmark_mobile/scan_buttons.dart';

class ble_demo_page extends StatelessWidget {
  @override
  Widget build(BuildContext context) {
    // Create instances of AdvertiseButtons and ScanButtons
    final advertiseButtons = AdvertiseButtons();
    final scanButtons = ScanButtons();
    return Scaffold(
      appBar: AppBar(
        title: const Text('BLE Advertising and Scanning Demo'),
      ),
      body: Padding(
        padding: const EdgeInsets.all(16.0),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.stretch,
          children: [
            // Section for Advertising
            Text(
              'Advertising Section',
              style: Theme.of(context).textTheme.titleLarge,
            ),
            const SizedBox(height: 10),
            advertiseButtons,
            const Divider(height: 40, thickness: 1),

            // Section for Scanning
            Text(
              'Scanning Section',
              style: Theme.of(context).textTheme.titleLarge,
            ),
            const SizedBox(height: 10),
            scanButtons,
          ],
        ),
      ),
    );
  }
}

void main() async {
  WidgetsFlutterBinding.ensureInitialized();
  await _requestPermissions();

  runApp(MaterialApp(
    home: ble_demo_page(),
  ));
}

Future<void> _requestPermissions() async {
  final NotificationPermission notificationPermission =
      await FlutterForegroundTask.checkNotificationPermission();
  if (notificationPermission != NotificationPermission.granted) {
    await FlutterForegroundTask.requestNotificationPermission();
  }

  if (!await Permission.bluetoothAdvertise.isGranted) {
    await Permission.bluetoothAdvertise.request();
  }

  if (!await Permission.bluetoothScan.isGranted) {
    await Permission.bluetoothScan.request();
  }

  if (!await Permission.bluetoothConnect.isGranted) {
    await Permission.bluetoothConnect.request();
  }

  if (Platform.isAndroid) {
    if (!await FlutterForegroundTask.isIgnoringBatteryOptimizations) {
      await FlutterForegroundTask.requestIgnoreBatteryOptimization();
    }
  }
}
