import 'package:flutter/material.dart';
import 'package:quickmark_mobile/components/input_field.dart';

//Color Pallete Constants
const white = Color(0xFFF7FCFF) ;
const lightBlue = Color(0xFF8DA9C4) ;
const blue = Color(0xFF134074) ;
const darkBlue = Color(0xFF13315C) ;
const navy = Color(0xFF0B2545) ;

class ForgotPassword extends StatefulWidget {
  const ForgotPassword({super.key});

  @override
  State<ForgotPassword> createState() => _ForgotPasswordState();
}

class _ForgotPasswordState extends State<ForgotPassword> {
  final emailController = TextEditingController();
  
  @override
  Widget build(BuildContext context) {
    return Scaffold(
      resizeToAvoidBottomInset: false, //Fixes the bottom when user uses keypad
      backgroundColor: white,
      
      body: SafeArea(
        child: Center(
          child: Column(
            children: [
              //Spacer for spacing
              const SizedBox(height: 50),
          
              //login logo
              Row(
                mainAxisAlignment: MainAxisAlignment.center,
                children: [
                  Image.asset(
                    'lib/images/QM.png',
                    height: 200,
                  ),
                ],
              ),        

              //Spacer for spacing
              const SizedBox(height: 50),

              const Text(
                'Reset Password',
                style: TextStyle(fontSize: 20, fontWeight: FontWeight.bold),
              ),

              const Padding(
                padding: EdgeInsets.symmetric(horizontal: 25.0, vertical: 3),
                child: Divider(
                  color: navy,
                  thickness: 0.5,
                ),
              ),

              //Spacer for spacing
              const SizedBox(height: 10),

              const Padding(
                padding: EdgeInsets.symmetric(horizontal: 25, vertical: 2),
                child: Row(
                  mainAxisAlignment: MainAxisAlignment.start,
                  children: [
                    Text(
                      'Email Address:',
                      style: TextStyle(fontSize: 14, fontWeight: FontWeight.bold, color: navy),
                    ),
                  ],
                ),
              ),

              textField(
                input: emailController,
                hintText: 'Email',
                obscureText: false, 
              ),

          ]),
        )
      )
    );
  }
}