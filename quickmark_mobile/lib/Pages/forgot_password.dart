import 'package:flutter/material.dart';
import 'package:quickmark_mobile/Pages/login_page.dart';
import 'package:quickmark_mobile/components/input_field.dart';
import 'package:quickmark_mobile/server_calls.dart';

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
  String errorMessage = '';

  void resetPassword(String email, context) async {
     //Json data
    final body = {
      'email': email,
    };
    
    //Make API call
    try {
      var response = await ServerCalls().post('/forgotPassword', body);
      if(response['error'] != '') {
        setState((){ //Creates the error message
          errorMessage = response['error'];
        });
      } else { 
        debugPrint('Login successful: ${response['user']}');
        setState((){ //Reset Error message
          errorMessage = response['error'];
        });
        Navigator.push(
          context,
          MaterialPageRoute(
            builder: (context) => const LoginPage(success: false),
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
            
            children: [
              AppBar(
                title: const Text(
                  'Forgot Password',
                  style: TextStyle(fontSize: 18),                
                ),
                leading: IconButton(
                  icon: const Icon(Icons.arrow_back_ios, color: Colors.grey),
                  onPressed: () => Navigator.of(context).pop(),
                ),
                 backgroundColor: Colors.blue.withOpacity(0),
                elevation: 0.0, //No shadow
              ),
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
                'Forgot your password?',
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
                padding: EdgeInsets.symmetric(horizontal: 25, vertical: 10),
                child: Row(
                  mainAxisAlignment: MainAxisAlignment.center,
                  children: [
                    Text(
                      'Enter the email you used to register with us\n and we will send you a link for a password reset!',
                      textAlign: TextAlign.center,
                      style: TextStyle(fontSize: 14, fontWeight: FontWeight.bold, color: navy,),
                    ),
                  ],
                ),
              ),

              textField(
                input: emailController,
                hintText: 'Email',
                obscureText: false, 
              ),

              //Spacer for spacing
              const SizedBox(height: 30),

              //Submit button
              SizedBox(
                width: 250,
                height: 60,
                child: ElevatedButton(
                  onPressed: () {
                    resetPassword(emailController.text, context);                  
                  },
                  style: ElevatedButton.styleFrom(
                    backgroundColor: blue,                   
                    shape: RoundedRectangleBorder(
                      borderRadius: BorderRadius.circular(10),
                    ),                                
                  ),
                  child: const Text(
                    'Reset Password',
                    style: TextStyle(
                      color: Colors.white,
                      fontWeight: FontWeight.bold,
                      fontSize: 16,
                    ),
                  ),
                ),
              ),

          ]),
        )
      )
    );
  }
}