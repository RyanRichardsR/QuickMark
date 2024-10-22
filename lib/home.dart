import 'dart:typed_data';

import 'package:flutter/material.dart';
import 'package:bluetooth_low_energy/bluetooth_low_energy.dart';
import 'package:permission_handler/permission_handler.dart';

class MyHomePage extends StatefulWidget {
  const MyHomePage({super.key, required this.title});
  final String title;

  @override
  State<MyHomePage> createState() => _MyHomePageState();
}

class _MyHomePageState extends State<MyHomePage> {

  @override
  void initState() {
    super.initState();
    getPermissions();
  }

  final PeripheralManager pm = PeripheralManager();
  bool isAdvertising = false;

  Advertisement data = Advertisement(
    name: "COP4331",
    serviceData: {
      UUID.fromString("32145678-1234-5678-1234-56789abcdef0") : Uint8List.fromList([255, 100, 255, 111, 255])
    }
  );

  void onOff() {
    setState(() {
      if (isAdvertising)
      {
        isAdvertising = false;
        pm.stopAdvertising();
      }
      else
      {
        isAdvertising = true;
        pm.startAdvertising(data);
      }
    });
  }

  Future<void> getPermissions() async {
    await Permission.bluetoothAdvertise.request();
    await Permission.bluetoothConnect.request();
    await Permission.bluetoothScan.request();
    await Permission.bluetooth.request();
    await Permission.location.request();
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
            FilledButton(
              style: FilledButton.styleFrom(
                backgroundColor: Colors.blue[700],
                fixedSize: const Size(300, 300),
                shape: const CircleBorder(),
                side: const BorderSide(width: 4.0),
              ),
              onPressed: onOff,
              child: isAdvertising ? const Text('STOP') : const Text('START'),
            ),
            if (isAdvertising)
            ...[
              Text('Name: ${data.name}'),
              Text('UUID: ${data.serviceData.keys}'),
              Text('Arbitrary data: ${data.serviceData.values}'),
            ],
          ],
        ),
      ),
    );
  }
}