import 'package:flutter/material.dart';
import 'package:shared_preferences/shared_preferences.dart';
import 'package:quickmark_mobile/Pages/login_page.dart';

//Color Pallete Constants
const white = Color(0xFFF7FCFF) ;
const lightBlue = Color(0xFF8DA9C4) ;
const blue = Color(0xFF134074) ;
const darkBlue = Color(0xFF13315C) ;
const navy = Color(0xFF0B2545) ;

class SideMenu extends StatelessWidget {
  final String name;
  final String role;

  const SideMenu({
    super.key,
    required this.name,
    required this.role
  });

  Future<void> logoutUser() async{
    final prefs = await SharedPreferences.getInstance();
    prefs.remove('userData');
  }

  @override
  Widget build(BuildContext context) {
    return Drawer(
      backgroundColor: white,
      width: 200,
      child: ListView(
        padding: EdgeInsets.zero,
        children: [
          DrawerHeader(
            decoration: const BoxDecoration(color: blue),
            padding: EdgeInsets.zero,
            child: Column(
              children: [
                const Icon(
                  Icons.account_circle,
                  size: 100,
                  color: white,
                ),
                Text(name, style: const TextStyle(color: Colors.white, fontSize: 20, fontWeight: FontWeight.bold),),
                Text(role, style: const TextStyle(color: Colors.white, fontSize: 16),)
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
              logoutUser();
              Navigator.pushReplacement(
                context,
                MaterialPageRoute(
                  builder: (context) => const LoginPage(success: false),
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