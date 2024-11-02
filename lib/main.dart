import 'package:flutter/material.dart';
import 'package:new_test/home.dart';
import 'package:permission_handler/permission_handler.dart';

Future<void> main() async {
  WidgetsFlutterBinding.ensureInitialized();
  runApp(const MyApp());
  if (await Permission.bluetoothScan.request().isGranted &&
      await Permission.location.request().isGranted) {
    runApp(const MyApp());
  } else {
    // If permissions are not granted, you may show an error page or handle it in another way
    runApp(const PermissionErrorApp());
  }
}

class PermissionErrorApp extends StatelessWidget {
  const PermissionErrorApp({super.key});

  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      title: 'Permission Error',
      theme: ThemeData(
        colorScheme: ColorScheme.fromSeed(seedColor: Colors.red),
        useMaterial3: true,
      ),
      home: Scaffold(
        appBar: AppBar(title: const Text('Permission Error')),
        body: const Center(
          child: Text(
            'Bluetooth and Location permissions are required to use this app. Please grant permissions and restart the app.',
          ),
        ),
      ),
    );
  }
}

class MyApp extends StatelessWidget {
  const MyApp({super.key});

  // This widget is the root of your application.
  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      title: 'Flutter Experiment',
      theme: ThemeData(
        colorScheme: ColorScheme.fromSeed(seedColor: Colors.deepPurple),
        useMaterial3: true,
      ),
      home: const MyHomePage(title: 'Flutter Experiment Home Page'),
    );
  }
}