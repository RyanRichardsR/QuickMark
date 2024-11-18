import 'package:flutter/material.dart';
import 'package:quickmark_mobile/Pages/about_us.dart';
import 'package:quickmark_mobile/Pages/profile.dart';
import 'package:shared_preferences/shared_preferences.dart';
import 'package:quickmark_mobile/Pages/login_page.dart';

//Color Pallete Constants
const white = Color(0xFFF7FCFF) ;
const lightBlue = Color(0xFF8DA9C4) ;
const blue = Color(0xFF134074) ;
const darkBlue = Color(0xFF13315C) ;
const navy = Color(0xFF0B2545) ;

class SideMenu extends StatelessWidget {
  final Map<String, dynamic> user;

  const SideMenu({
    super.key,
    required this.user,
  });

  Future<void> logoutUser() async{
    final prefs = await SharedPreferences.getInstance();
    prefs.remove('userData');
  }

  @override
  Widget build(BuildContext context) {
    final String name = user['firstName'];
    final String role = user['role'];
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
              if (ModalRoute.of(context)?.settings.name == '/SideRoute') {
                Navigator.pushReplacement(
                context,
                  MaterialPageRoute(
                    builder: (context) => ProfilePage(user: user),
                    settings: RouteSettings(name: '/SideRoute'),
                  ),
                );
              }
              else {
                Navigator.push(
                context,
                  MaterialPageRoute(
                    builder: (context) => ProfilePage(user: user),
                    settings: RouteSettings(name: '/SideRoute'),
                  ),
                );
              }
              
            },
          ),
          
          ListTile(
            iconColor: Colors.red,
            textColor: Colors.red,
            leading: const Icon(Icons.logout),
            title: const Text('Logout'),
            onTap: () {
              logoutUser();
              Navigator.pushAndRemoveUntil(
                context,
                MaterialPageRoute(
                  builder: (context) => const LoginPage(success: false),
                ),
                (route) => false,
              );
            },
          ),

          const SizedBox(height: 100),
          const Divider(color: navy,),
          ListTile(
            leading: const Icon(Icons.group),
            title: const Text('About Us'),
            onTap: () {
              if (ModalRoute.of(context)?.settings.name == '/SideRoute') {
                Navigator.pushReplacement(
                context,
                  MaterialPageRoute(
                    builder: (context) => AboutUs(user: user),
                    settings: RouteSettings(name: '/SideRoute'),
                  ),
                );
              }
              else {
                Navigator.push(
                context,
                  MaterialPageRoute(
                    builder: (context) => AboutUs(user: user),
                    settings: RouteSettings(name: '/SideRoute'),
                  ),
                );
              }
            },
          ),
        ],
      ),
    );
  }
}