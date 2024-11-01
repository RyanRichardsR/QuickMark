import 'package:flutter/material.dart';
import 'package:quickmark_mobile/Pages/login_page.dart';

//Color Pallete Constants
const white = Color(0xFFF7FCFF) ;
const lightBlue = Color(0xFF8DA9C4) ;
const blue = Color(0xFF134074) ;
const darkBlue = Color(0xFF13315C) ;
const navy = Color(0xFF0B2545) ;

class SideMenu extends StatelessWidget {
  const SideMenu({super.key});

  @override
  Widget build(BuildContext context) {
    return Drawer(
      backgroundColor: white,
      width: 200,
      child: ListView(
        padding: EdgeInsets.zero,
        children: [
          const DrawerHeader(
            decoration: BoxDecoration(color: blue),
            padding: EdgeInsets.zero,
            child: Column(
              children: [
                CircleAvatar(
                  radius: 50,
                  backgroundColor: Colors.white,
                ),
                const Text('Name', style: TextStyle(color: Colors.white, fontSize: 20, fontWeight: FontWeight.bold),),
              ],
            ),
          ),
          ListTile(
            leading: const Icon(Icons.account_circle),
            title: const Text('Profile'),
            onTap: () {
              
            },
          ),
          
          ListTile(
            iconColor: Colors.red,
            textColor: Colors.red,
            leading: const Icon(Icons.logout),
            title: const Text('Logout'),
            onTap: () {
              Navigator.pushReplacement(
                context,
                MaterialPageRoute(
                  builder: (context) => const LoginPage(),
                ),
              );
            },
          ),

          const SizedBox(height: 100),
          const Divider(color: navy,),
          ListTile(
            leading: const Icon(Icons.group),
            title: const Text('About Us'),
            onTap: () {
              
            },
          ),
        ],
      ),
    );
  }
}