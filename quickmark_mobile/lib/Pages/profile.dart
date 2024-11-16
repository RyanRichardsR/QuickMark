import 'package:confetti/confetti.dart';
import 'package:flutter/material.dart';
import 'package:quickmark_mobile/components/side_menu.dart';

const white = Color(0xFFF7FCFF) ;
const lightBlue = Color(0xFF8DA9C4) ;
const blue = Color(0xFF134074) ;
const darkBlue = Color(0xFF13315C) ;
const navy = Color(0xFF0B2545) ;

class ProfilePage extends StatefulWidget {
  final Map<String, dynamic> user;

  const ProfilePage({
    super.key,
    required this.user,
  });

  @override
  State<ProfilePage> createState() => _ProfilePageState();
}

class _ProfilePageState extends State<ProfilePage> {

  final confettiController = ConfettiController();

  @override
  void dispose() {
    confettiController.dispose();
    super.dispose();
  }
  
  @override
  Widget build(BuildContext context) {
    return Stack(
      alignment: Alignment.topCenter,
      children: [
        Scaffold(
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
          endDrawer: SideMenu(user: widget.user),
        
          body: Padding(
            padding: EdgeInsets.all(20.0),
            child: Column(
              mainAxisAlignment: MainAxisAlignment.start,
              children: [
                SizedBox(height: 40),
                Row(
                  mainAxisAlignment: MainAxisAlignment.center,
                  children: [
                    Icon(
                      Icons.account_circle,
                        size: 200,
                        color: blue,
                    ),
                  ],
                ),
                SizedBox(height: 15),
                Text(
                  "${widget.user['firstName']} ${widget.user['lastName']}",
                  style: TextStyle(
                    color: Colors.black,
                    fontWeight: FontWeight.bold,
                    fontSize: 25
                  )
                ),
                SizedBox(height: 5),
                Text(
                  "${widget.user['role']}",
                  style: TextStyle(
                    color: Colors.black,
                    fontSize: 18,
                  )
                ),
        
                SizedBox(height: 200),
        
                SizedBox(
                  width: 250,
                  height: 80,
                  child: ElevatedButton(
                    onPressed: () {
                      confettiController.play();             
                    },
                    style: ElevatedButton.styleFrom(
                      backgroundColor: Colors.red,                   
                      shape: RoundedRectangleBorder(
                        borderRadius: BorderRadius.circular(10),
                      ),
                    ),
                    
                    child: Row(
                      mainAxisAlignment: MainAxisAlignment.center,
                      children: [
                        Icon(
                          Icons.delete,
                            size: 30,
                            color: white,
                        ),
                        const Text(
                          'Delete Account',
                          style: TextStyle(
                            color: Colors.white,
                            fontWeight: FontWeight.bold,
                            fontSize: 20,
                          ),
                        ),
                      ],
                    ),
                  ),
                ),
        
              ],
            )
          )
        ),
        ConfettiWidget(
          confettiController: confettiController,
          shouldLoop: false,
          blastDirectionality: BlastDirectionality.explosive,
          emissionFrequency: 0.1,
        )
      ]
    );
  }
}