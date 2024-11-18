import 'package:flutter/material.dart';
import 'package:quickmark_mobile/components/side_menu.dart';

//Color Pallete Constants
const white = Color(0xFFF7FCFF) ;
const lightBlue = Color(0xFF8DA9C4) ;
const blue = Color(0xFF134074) ;
const darkBlue = Color(0xFF13315C) ;
const navy = Color(0xFF0B2545) ;

const pictureSize = 130.0;
const textSize = 20.0;
const subtitleSize = 13.0;


class AboutUs extends StatelessWidget {
  final Map<String, dynamic> user;

  final List us = const [
    ['Ryan', 'Mobile Dev'],
    ['Dina', 'Frontend Web Dev'],
    ['Niklas', 'Bluetooth/Mobile Dev'],
    ['Thaw', 'Bluetooth/Mobile Dev'],
    ['Sam', 'API/Database'],
    ['Anthony', 'API/Database']
  ];

  const AboutUs({
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
            
            const Text(
                'QuickMark',
                style: TextStyle(
                  color: white,
                  fontWeight: FontWeight.bold,
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
          children: [
            Text(
                'About Us:',
                textAlign: TextAlign.center,
                style: TextStyle(
                  fontSize: 25,
                  fontWeight: FontWeight.bold,
                ),
            ),
            Divider(
              height: 40,
              color: navy,
            ),
            Expanded(child: GridView.builder(
              gridDelegate: const SliverGridDelegateWithFixedCrossAxisCount(
                crossAxisCount: 2,
                crossAxisSpacing: 20,
                mainAxisSpacing: 20,
                childAspectRatio: 0.8,
              ),
              itemCount: us.length,
              itemBuilder: (context, index) {
                return Column(
                  mainAxisSize: MainAxisSize.min,
                  children: [
                    Icon(
                      Icons.account_circle,
                        size: pictureSize,
                        color: blue,
                    ),
                    Text(us[index][0], style: TextStyle(fontSize: textSize, fontWeight: FontWeight.bold,)),
                    Text(us[index][1], style: TextStyle(fontSize: subtitleSize,)),
                  ],
                );
              }
            ),),
          ],
        ),
      )
    );
  }
}