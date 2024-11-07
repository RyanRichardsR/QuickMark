import 'package:flutter/material.dart';
import 'package:quickmark_mobile/Pages/login_page.dart';

//Color Pallete Constants
const white = Color(0xFFEEF4ED) ;
const lightBlue = Color(0xFF8DA9C4) ;
const blue = Color(0xFF134074) ;
const darkBlue = Color(0xFF13315C) ;
const navy = Color(0xFF0B2545) ;

void main() {
  runApp(const MyApp());
}

class MyApp extends StatelessWidget {
  const MyApp({super.key});

  @override
  Widget build(BuildContext context) {
    return const MaterialApp(
      debugShowCheckedModeBanner: false,
      home: LoginPage(success: false,),
    );
  }
}