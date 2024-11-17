import 'dart:convert';
import 'package:flutter/material.dart';
import 'package:shared_preferences/shared_preferences.dart';
import 'package:quickmark_mobile/Pages/dashboard.dart';
import 'package:quickmark_mobile/Pages/forgot_password.dart';
import 'package:quickmark_mobile/Pages/register_page.dart';
import 'package:quickmark_mobile/components/input_field.dart';
import 'package:quickmark_mobile/server_calls.dart';


//Color Pallete Constants
const white = Color(0xFFF7FCFF) ;
const lightBlue = Color(0xFF8DA9C4) ;
const blue = Color(0xFF134074) ;
const darkBlue = Color(0xFF13315C) ;
const navy = Color(0xFF0B2545) ;

class LoginPage extends StatefulWidget {
  final bool success;

  const LoginPage({
    super.key,
    required this.success
  });
  @override
  State<LoginPage> createState() => _LoginPageState();
}


class _LoginPageState extends State<LoginPage> {
  
  // text inputs
  final usernameController = TextEditingController();
  final passwordController = TextEditingController();
  String errorMessage = '';

  @override
  void initState() {
    super.initState();

    // Shows a message for successful registration
    if (widget.success) {
      Future.delayed(Duration.zero, () => _showRegistrationSuccessDialog(context));
    }
  }

  void _showRegistrationSuccessDialog(BuildContext context) {
    showDialog(
      context: context,
      builder: (BuildContext context) {
        return const AlertDialog(
          title: Text('Registration Successful!'),
          content: Row(
            mainAxisAlignment: MainAxisAlignment.center,
            children: [
              Text('Please verify your email!')
            ],
          ),
        );
      },
    );

    // Automatically close the dialog after a second
    Future.delayed(const Duration(seconds: 2), () {
      Navigator.of(context).pop(); // Close the dialog
    });
  }

  Future<void> saveUserLogin(Map<String, dynamic> userData) async {
    final prefs = await SharedPreferences.getInstance();
    String userJsonString = jsonEncode(userData);
    prefs.setString('userData', userJsonString);
  }

  // Login API function
  void signIn(String username, String password, context) async {
    //Json data
    final body = {
      'login': username,
      'password': password,
    };
    
    //Make API call
    try {
      var response = await ServerCalls().post('/login', body);
      if(response['error'] != '') {
        setState((){ //Creates the error message
          errorMessage = response['error'];
        });
      } else { //Logs the User in
        debugPrint('Login successful: ${response['user']}');
        setState((){ //Reset Error message
          errorMessage = response['error'];
        });
        saveUserLogin(response['user']);
        Navigator.pushReplacement( //Redirect to the Dashboard
          context,
          MaterialPageRoute(
            builder: (context) => Dashboard(user : response['user']),
          ),
        );
      }
    } catch (err) {
      debugPrint('Error: $err');
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      resizeToAvoidBottomInset: false, //Fixes the bottom when user uses keypad
      backgroundColor: white,
      
      body: SafeArea(
        child: Center(
          child: Column(
            mainAxisAlignment: MainAxisAlignment.center,
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
              const SizedBox(height: 35),
          
              //welcome back message for our valueable users
              const Text(
                'Welcome back to QuickMark!',
                style: TextStyle(fontSize: 18, color: navy),
              ),
            
              //Spacer for spacing
              const SizedBox(height: 40),
          
              //username
              textField(
                input: usernameController,
                hintText: 'Username or Email',
                obscureText: false,
                paddingHorizontal: 20.0,
              ),
          
              //Spacer for spacing
              const SizedBox(height: 25),
          
              //password
              textField(
                input: passwordController,
                hintText: 'Password',
                obscureText: true, 
                paddingHorizontal: 20.0,
              ),
          
              //Spacer for spacing
              const SizedBox(height: 7),
          
              //forgot password
              Padding(
                padding: const EdgeInsets.symmetric(horizontal: 25.0),
                child: Row(
                  mainAxisAlignment: MainAxisAlignment.end,
                  children: [
                    GestureDetector(
                    onTap: () => {
                      Navigator.push(
                        context,
                        MaterialPageRoute(builder: (context) => const ForgotPassword() )
                      )
                    },
                    child: Text(                    
                      'Forgot Password?',
                      style: TextStyle(fontSize: 13, color: Colors.grey.shade600),
                    ),
                  ),
                  ],
                ),
              ),
          
              //Spacer for spacing
              const SizedBox(height: 15),

              //Shows error message for failed login
              if (errorMessage.isNotEmpty) 
              Padding(
                padding: const EdgeInsets.only(bottom: 8.0),
                child: Text(
                  errorMessage,  // Display the error message
                  style: const TextStyle(
                    color: Colors.red,
                    fontSize: 14,
                  ),
                ),
              ),

              //Log in button
              SizedBox(
                width: 250,
                height: 60,
                child: ElevatedButton(
                  onPressed: () {
                    signIn(usernameController.text, passwordController.text, context);                  
                  },
                  style: ElevatedButton.styleFrom(
                    backgroundColor: blue,                   
                    shape: RoundedRectangleBorder(
                      borderRadius: BorderRadius.circular(10),
                    ),                                
                  ),
                  child: const Text(
                    'Sign In',
                    style: TextStyle(
                      color: Colors.white,
                      fontWeight: FontWeight.bold,
                      fontSize: 16,
                    ),
                  ),
                ),
              ),
          
              //Spacer for spacing
              const SizedBox(height: 170),

              //Register button
              Row(
                mainAxisAlignment: MainAxisAlignment.center,
                children: [
                  Text(
                    'Don\'t have an account?',
                    style: TextStyle(color: Colors.grey.shade600),
                  ),
                  const SizedBox(width: 4,),
                  GestureDetector(
                    onTap: () => {
                      Navigator.push(
                        context,
                        MaterialPageRoute(builder: (context) => const Register() )
                      )
                    },
                    child: const Text(                    
                      'Register Now',
                      style: TextStyle(color: Colors.blue, fontWeight: FontWeight.bold),
                    ),
                  ),
                ],
              ),
          ]),
        ),
      )
    );
  }
}

