import 'package:bluetooth_low_energy/bluetooth_low_energy.dart';
import 'package:flutter/material.dart';
import 'package:permission_handler/permission_handler.dart';
import 'package:quickmark_mobile/components/side_menu.dart';

//Color Pallete Constants
const white = Color(0xFFF7FCFF) ;
const lightBlue = Color(0xFF8DA9C4) ;
const blue = Color(0xFF134074) ;
const darkBlue = Color(0xFF13315C) ;
const navy = Color(0xFF0B2545) ;

class ClassProf extends StatefulWidget {
  final String title;

  const ClassProf({super.key, required this.title});

  @override
  State<ClassProf> createState() => _ClassProfState();
}

class _ClassProfState extends State<ClassProf> {

  @override
  void initState() {
    super.initState();
    _initAsync();
  }

  Future<void>_initAsync() async {
    hasPermission = await MyFunctions.getPermissions();
  }

  final PeripheralManager pm = PeripheralManager();
  bool isAdvertising = false;
  bool hasPermission = false;
  
  // This gets broadcasted
  final Advertisement data = Advertisement(
    name: "COP4331",
    serviceUUIDs: [
      UUID.fromString("32145678-1234-5678-1234-56789abcdef0"),
    ],
  );

  // Toggle on/off
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

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        backgroundColor: blue,
        iconTheme: const IconThemeData(color: white),
        title: Row(
          mainAxisAlignment: MainAxisAlignment.center,
          children: [
            Image.asset(
                    'lib/images/QM_white.png',
                    height: 60,
                  ),
            const Text(
              'QuickMark',
              style: TextStyle(
                color: white,
                fontWeight: FontWeight.bold,
              ),
            ),
            const SizedBox(width: 50)
          ],
        ),
      ),
      endDrawer: const SideMenu(name: 'name', role: 'role'),
      body: Center(
        child: Column(
          mainAxisAlignment: MainAxisAlignment.center,
          children: [
            FilledButton(
              style: FilledButton.styleFrom(
                backgroundColor: blue,
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
              Text('UUID: ${data.serviceUUIDs}'),
            ],
          ],
        ),
      ),
    );
  }
}

class MyFunctions {
  
  static Future<bool> getPermissions () async {
    PermissionStatus locationStatus = await Permission.location.request();
    PermissionStatus bluetoothStatus = await Permission.bluetooth.request();
    PermissionStatus bluetoothConnectStatus = await Permission.bluetoothConnect.request();
    PermissionStatus bluetoothScanStatus = await Permission.bluetoothScan.request();
    PermissionStatus bluetoothAdvertiseStatus = await Permission.bluetoothAdvertise.request();

    if (locationStatus.isGranted && 
        bluetoothStatus.isGranted && 
        bluetoothConnectStatus.isGranted && 
        bluetoothScanStatus.isGranted &&
        bluetoothAdvertiseStatus.isGranted) {
      // Permissions are granted, proceed with BLE operations
      print('All permissions granted.');
      return true;
    }
    else {
      // Handle permission denial
      print('Permissions denied. Please enable them in settings.');
      return false;
    }
  }
}