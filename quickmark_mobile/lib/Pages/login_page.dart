import 'package:flutter/material.dart';
import 'package:quickmark_mobile/Pages/dashboard.dart';
import 'package:quickmark_mobile/components/input_field.dart';
import 'package:quickmark_mobile/server_calls.dart';


//Color Pallete Constants
const white = Color(0xFFF7FCFF) ;
const lightBlue = Color(0xFF8DA9C4) ;
const blue = Color(0xFF134074) ;
const darkBlue = Color(0xFF13315C) ;
const navy = Color(0xFF0B2545) ;

class LoginPage extends StatefulWidget {
  const LoginPage({super.key});

  @override
  _LoginPageState createState() => _LoginPageState();
}


class _LoginPageState extends State<LoginPage> {
  // text inputs
  final usernameController = TextEditingController();
  final passwordController = TextEditingController();
  String errorMessage = '';
  
  
  // sign in function
  void signIn(String username, String password, context) async {
    final body = {
      'login': username,
      'password': password,
    };
    
    try {
      var response = await ServerCalls().post('/login', body);
      if(response['error'] != '') {
        setState((){
          errorMessage = response['error'];
        });
      } else {
        debugPrint('Login successful: ${response['user']}');
        setState((){
          errorMessage = response['error'];
        });
        Navigator.pushReplacement(
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
      resizeToAvoidBottomInset: false,
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
              ),
          
              //Spacer for spacing
              const SizedBox(height: 25),
          
              //password
              textField(
                input: passwordController,
                hintText: 'Password',
                obscureText: true, 
              ),
          
              //Spacer for spacing
              const SizedBox(height: 7),
          
              //forgot password
              Padding(
                padding: const EdgeInsets.symmetric(horizontal: 25.0),
                child: Row(
                  mainAxisAlignment: MainAxisAlignment.end,
                  children: [
                    Text(
                      'Forgot Password?',
                      style: TextStyle(fontSize: 13, color: Colors.grey.shade600),
                      ),
                  ],
                ),
              ),
          
              //Spacer for spacing
              const SizedBox(height: 15),

              if (errorMessage.isNotEmpty) 
              const Padding(
                padding: EdgeInsets.only(bottom: 8.0),
                child: Text(
                  'Username or Password is Incorrect',  // Display the error message
                  style: TextStyle(
                    color: Colors.red,
                    fontSize: 14,
                  ),
                ),
              ),

              
          
              //sign in button
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

              //signup button
              Row(
                mainAxisAlignment: MainAxisAlignment.center,
                children: [
                  Text(
                    'Don\'t have an account?',
                    style: TextStyle(color: Colors.grey.shade600),
                  ),
                  const SizedBox(width: 4,),
                  const Text(
                    'Register Now',
                    style: TextStyle(color: Colors.blue, fontWeight: FontWeight.bold),
                  ),
                ],
              ),

              //Spacer for spacing
              //const SizedBox(height: 30),
          ]),
        ),
      )
    );
  }
}

