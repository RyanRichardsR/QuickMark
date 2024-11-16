import 'package:flutter/material.dart';
import 'package:quickmark_mobile/Pages/dashboard.dart';
import 'package:quickmark_mobile/components/side_menu.dart';

const white = Color(0xFFF7FCFF) ;
const lightBlue = Color(0xFF8DA9C4) ;
const blue = Color(0xFF134074) ;
const darkBlue = Color(0xFF13315C) ;
const navy = Color(0xFF0B2545) ;


class ProfilePage extends StatelessWidget {
  final Map<String, dynamic> user;

  const ProfilePage({
    super.key,
    required this.user,
  });

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: white,
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
            GestureDetector(
              onTap:() => {
                Navigator.push(
                  context,
                  MaterialPageRoute(builder: (context) => Dashboard(user: user) )
                )
              },
              child: const Text(
                'QuickMark',
                style: TextStyle(
                  color: white,
                  fontWeight: FontWeight.bold,
                ),
                
              ),
            ),
            const SizedBox(width: 25)
          ],
        ),
      ),

      // This is the side menu
      endDrawer: SideMenu(user: user),

      body: Padding(
        padding: EdgeInsets.all(20.0),
        child: Column(
          mainAxisAlignment: MainAxisAlignment.center,
          children: [
            SizedBox(height: 40),
            Icon(
              Icons.account_circle,
                size: 200,
                color: blue,
            ),
          ],
        )
      )
    );
  }
}