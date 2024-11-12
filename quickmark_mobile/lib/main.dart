import 'dart:convert';

import 'package:flutter/material.dart';
import 'package:quickmark_mobile/Pages/dashboard.dart';
import 'package:quickmark_mobile/Pages/login_page.dart';
import 'package:shared_preferences/shared_preferences.dart';

void main() {
  runApp(const MyApp());
}

class MyApp extends StatefulWidget {
  const MyApp({super.key});

  @override
  State<MyApp> createState() => _MyAppState();
}

class _MyAppState extends State<MyApp> {
  late Future<Map<String, dynamic>?> userInfo;

  Future<Map<String, dynamic>?> getUserData() async {
    final prefs = await SharedPreferences.getInstance();
    String? userJsonString = prefs.getString('userData');
    if (userJsonString != null) {
      return jsonDecode(userJsonString);
    } else {
      return null; // Return an empty map if no data exists
    }
  }

  @override
  void initState() {
    super.initState();
    userInfo = getUserData();
  }

  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      debugShowCheckedModeBanner: false,
      home: FutureBuilder<Map<String, dynamic>?>(
        future: userInfo,
        builder: (context, snapshot) {
          if (snapshot.connectionState == ConnectionState.waiting) {
            return const Scaffold(
              body: Center(child: CircularProgressIndicator()),
            );
          } else if (snapshot.hasData && snapshot.data != null) {
            // If logged in, go to the dashboard
            return Dashboard(user: snapshot.data!);
          } else {
            // Otherwise, go to the login screen
            return const LoginPage(success: false);
          }
        },
      ),
    );
  }
}