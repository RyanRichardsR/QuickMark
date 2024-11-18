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

      body: const Padding(
        padding: EdgeInsets.all(30.0),
        child: Column(
          
          mainAxisAlignment: MainAxisAlignment.start,
          children: [
            Padding(
              padding: EdgeInsets.only(top: 8.0),
              child: Text(
                'About Us:',
                textAlign: TextAlign.center,
                style: TextStyle(
                  fontSize: 25,
                  fontWeight: FontWeight.bold,
                ),
              ),
            ),

            Divider(
              height: 40,
              color: navy,
            ),

            Row(
              mainAxisAlignment: MainAxisAlignment.spaceBetween,
              children: [          
                Column(           
                  mainAxisAlignment: MainAxisAlignment.spaceEvenly,
                  children: [
                    Icon(
                      Icons.account_circle,
                        size: pictureSize,
                        color: blue,
                    ),
                    Text("Ryan", style: TextStyle(fontSize: textSize, fontWeight: FontWeight.bold,)),
                    Text("Mobile Dev", style: TextStyle(fontSize: subtitleSize,)),
                    Icon(
                      Icons.account_circle,
                        size: pictureSize,
                        color: blue,
                    ),
                    Text("Niklas", style: TextStyle(fontSize: textSize, fontWeight: FontWeight.bold,)),
                    Text("Bluetooth/Mobile Dev", style: TextStyle(fontSize: subtitleSize,)),
                    Icon(
                      Icons.account_circle,
                        size: pictureSize,
                        color: blue,
                    ),
                    Text("Sam", style: TextStyle(fontSize: textSize, fontWeight: FontWeight.bold,)),
                    Text("API/Database", style: TextStyle(fontSize: subtitleSize,)),
                  ],
                ),
                Column(           
                  mainAxisAlignment: MainAxisAlignment.spaceEvenly,
                  children: [
                    Icon(
                      Icons.account_circle,
                        size: pictureSize,
                        color: blue,
                    ),
                    Text("Dina", style: TextStyle(fontSize: textSize, fontWeight: FontWeight.bold,)),
                    Text("Front-End Web Dev", style: TextStyle(fontSize: subtitleSize,)),
                    Icon(
                      Icons.account_circle,
                        size: pictureSize,
                        color: blue,
                    ),
                    Text("Thaw", style: TextStyle(fontSize: textSize, fontWeight: FontWeight.bold,)),
                    Text("Bluetooth/Mobile Dev", style: TextStyle(fontSize: subtitleSize,)),
                    Icon(
                      Icons.account_circle,
                        size: pictureSize,
                        color: blue,
                    ),
                    Text("Anthony", style: TextStyle(fontSize: textSize, fontWeight: FontWeight.bold,)),
                    Text("API/Database", style: TextStyle(fontSize: subtitleSize,)),
                  ],
                ),
              ],
            ),
          ],
        ),
      )
    );
  }
}