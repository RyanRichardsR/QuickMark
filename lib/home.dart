import 'package:flutter/material.dart';
import 'package:flutter_blue_plus/flutter_blue_plus.dart';
import 'package:permission_handler/permission_handler.dart';

class MyHomePage extends StatefulWidget {
  const MyHomePage({super.key, required this.title});
  final String title;

  @override
  State<MyHomePage> createState() => _MyHomePageState();
}

class _MyHomePageState extends State<MyHomePage> {
  final String targetUUID = "32145678-1234-5678-1234-56789abcdef0"; // Replace with your target UUID
  bool isDeviceFound = false;
  String? deviceName;

  @override
  void initState() {
    super.initState();
    getPermissions();
  }

  Future<void> getPermissions() async {
    await Permission.bluetoothScan.request();
    await Permission.bluetoothConnect.request();
    await Permission.location.request();
    startScan();
  }

  void startScan() {
    // Start scanning with a filter for the target UUID
    FlutterBluePlus.startScan(
      timeout: Duration(seconds: 10),
      withServices: [Guid(targetUUID)],
    );

    // Listen for scan results
    FlutterBluePlus.scanResults.listen((scanResults) {
      for (var result in scanResults) {
        if (result.advertisementData.serviceUuids.contains(targetUUID)) {
          setState(() {
            isDeviceFound = true;
            deviceName = result.device.name;
          });
          FlutterBluePlus.stopScan(); // Stop scanning once the target device is found
          break;
        }
      }
    });
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        backgroundColor: Colors.blue[700],
        title: Text(widget.title),
      ),
      body: Center(
        child: Column(
          mainAxisAlignment: MainAxisAlignment.center,
          children: [
            Text(
              isDeviceFound ? 'Device Found!' : 'Scanning for device...',
              style: TextStyle(fontSize: 24, color: isDeviceFound ? Colors.green : Colors.red),
            ),
            if (isDeviceFound)
              ...[
                Text('Device Name: $deviceName'),
                Text('UUID: $targetUUID'),
              ],
            SizedBox(height: 20),
            FilledButton(
              style: FilledButton.styleFrom(
                backgroundColor: Colors.blue[700],
                fixedSize: const Size(300, 300),
                shape: const CircleBorder(),
                side: const BorderSide(width: 4.0),
              ),
              onPressed: startScan,
              child: const Text('Scan Again'),
            ),
          ],
        ),
      ),
    );
  }
}
