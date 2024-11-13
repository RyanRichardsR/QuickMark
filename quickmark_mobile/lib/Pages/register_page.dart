import 'package:flutter/material.dart';
import 'package:quickmark_mobile/Pages/login_page.dart';
import 'package:quickmark_mobile/components/input_field.dart';
import 'package:quickmark_mobile/components/password_requirements.dart';
import 'package:quickmark_mobile/components/small_input_field.dart';
import 'package:quickmark_mobile/server_calls.dart';

//Color Constants
const white = Color(0xFFF7FCFF) ;
const lightBlue = Color(0xFF8DA9C4) ;
const blue = Color(0xFF134074) ;
const darkBlue = Color(0xFF13315C) ;
const navy = Color(0xFF0B2545) ;

class Register extends StatefulWidget {
  const Register({super.key});

  @override
  State<Register> createState() => _RegisterState();
}

class _RegisterState extends State<Register> {
  
  // text inputs
  final firstNameController = TextEditingController();
  final lastNameController = TextEditingController();
  final emailController = TextEditingController();
  final usernameController = TextEditingController();
  final confirmPasswordController = TextEditingController();
  final passwordController = TextEditingController();
  String? _role = '';
  
  // Validation functions
  final FocusNode passwordFocusNode = FocusNode();
  bool showPasswordStrength = false;
  bool hasLength = false;
  bool hasUpperCase = false;
  bool hasLowerCase = false;
  bool hasSpecialChar = false;
  bool hasNumber = false;

  String errorMessage = '';


  // Validate password
  @override
  void initState() {
    super.initState();

    // Add a listener to the FocusNode to detect focus changes
    passwordFocusNode.addListener(() {
      setState(() {
        showPasswordStrength = passwordFocusNode.hasFocus;
      });
    });

    // Add a listener to the passwordController to validate password criteria
    passwordController.addListener(() {
      _validatePassword(passwordController.text);
    });
  }

  //Check the password for requirements
  void _validatePassword(String password) {
    setState(() {
      hasUpperCase = password.contains(RegExp(r'[A-Z]'));
      hasLowerCase = password.contains(RegExp(r'[a-z]'));
      hasSpecialChar = password.contains(RegExp(r'[@$!%*?&]')); // Define special characters
      hasNumber = password.contains(RegExp(r'[0-9]'));
      hasLength = password.length >= 8;
    });
  }

  // Register API function
  void signUp(String username, String password, String firstName, String lastName, String email, String role, String confirm, context) async {
    if (firstName == '' ) {
      setState((){ //Creates the error message
          errorMessage = 'You must input a first name';
      });  
      return;
    }else if (lastName == '') {
      setState((){ //Creates the error message
          errorMessage = 'You must input a last name';
      });  
      return;
    }else if (email == ''){
      setState((){ //Creates the error message
          errorMessage = 'You must input an email address';
      });  
      return;
    }else if (username == ''){
      setState((){ //Creates the error message
          errorMessage = 'You must input a username';
      });  
      return;
    }else if (password == ''){
      setState((){ //Creates the error message
          errorMessage = 'You must input a password';
      });  
      return;
    }else if (role == ''){
      setState((){ //Creates the error message
          errorMessage = 'You must select Teacher or Student';
      });  
      return;
    }

    if (!hasUpperCase ||!hasLowerCase ||!hasSpecialChar ||!hasNumber ||!hasLength) {
      setState((){ //Creates the error message
          errorMessage = 'Password does not meet requirements';
      });  
      return;
    }
  
    if (confirm.trim() != password.trim()){
      setState((){ //Creates the error message
          errorMessage = 'Passwords do not match';
      });  
      return;
    }
    
    final body = {
      'login': username,
      'password': password,
      'firstName': firstName,
      'lastName': lastName,
      'email': email,
      'role': role,
    };
    
    try {
      var response = await ServerCalls().post('/register', body);
      if(response['error'] != '') {
        setState((){ //Error message found and populated
          errorMessage = response['error'];
        });
      } else {
        debugPrint('Registration successful: ${response['success']}');
        setState((){ //no error, reset error to nothing :)
          errorMessage = response['error'];
        });
        Navigator.push( //Redirect
          context,
          MaterialPageRoute(
            builder: (context) =>  const LoginPage(success: true),
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
              //Quickmark logo
              Row(
                mainAxisAlignment: MainAxisAlignment.center,
                children: [
                  Image.asset(
                    'lib/images/QM.png',
                    height: 175,
                  ),
                ],
              ),
          
              //Sign up text for our soon to be users
              const Text(
                'Create an Account!',
                style: TextStyle(fontSize: 22, color: navy),
              ),

              
              //Spacer for spacing
              const SizedBox(height: 25),
          
              //First Name Last Name
              Row(
                mainAxisAlignment: MainAxisAlignment.center,
                children: [
                  smallTextField( //First Name
                    input: firstNameController,
                    hintText: 'First Name',
                    obscureText: false,
                  ),

                  smallTextField( //Last Name
                    input: lastNameController,
                    hintText: 'Last Name',
                    obscureText: false,
                  ),
                ],                
              ),

              //Spacer for spacing
              const SizedBox(height: 25),
          
              //Email
              textField(
                input: emailController,
                hintText: 'Email Address',
                obscureText: false,
              ),

              //Spacer for spacing
              const SizedBox(height: 25),
          
              //Username
              textField(
                input: usernameController,
                hintText: 'Username',
                obscureText: false,
              ),

              //Spacer for spacing
              if(!showPasswordStrength)
                const SizedBox(height: 25),
              if(showPasswordStrength)
                const SizedBox(height: 10),
              
              //Shows the password requirements only when password field is enabled
              if(showPasswordStrength)
                Row(
                  mainAxisAlignment: MainAxisAlignment.center,
                  children: [
                  PasswordRequirements(label: 'At Least\n8 Characters', isMet: hasLength),
                  const SizedBox(width: 10),
                  PasswordRequirements(label: 'Uppercase\nLetter', isMet: hasUpperCase),
                  const SizedBox(width: 10),
                  PasswordRequirements(label: 'Lowercase\nLetter', isMet: hasLowerCase),
                  const SizedBox(width: 10),
                  PasswordRequirements(label: 'Special\nCharacter', isMet: hasSpecialChar),
                  const SizedBox(width: 10),
                  PasswordRequirements(label: 'Number', isMet: hasNumber),
                  ],
                ),
                  
              if(showPasswordStrength)
                const SizedBox(height: 5), //spacer for spacing

              //Password
              Padding(
                padding: const EdgeInsets.symmetric(horizontal: 20),
                child: TextField(
                  controller: passwordController,
                  obscureText: true,
                  focusNode: passwordFocusNode,
                  decoration: InputDecoration(
                    enabledBorder: const OutlineInputBorder(
                      borderSide: BorderSide(color: Colors.grey),
                    ),
                    focusedBorder: const OutlineInputBorder(
                      borderSide: BorderSide(color: Colors.black),
                    ),
                    fillColor: Colors.white,
                    filled: true,
                    hintText: 'Password',
                    hintStyle: TextStyle(color: Colors.grey.shade500),
                  ),
                ),
              ),

              //Spacer for spacing
              const SizedBox(height: 25),

              //Confirm Password
              textField(
                input: confirmPasswordController,
                hintText: 'Confirm Password',
                obscureText: true,
              ),

              //Spacer for spacing
              const SizedBox(height: 25),

              //Teacher or Student boxes
              Padding(
                padding: const EdgeInsets.symmetric(horizontal: 20.0),
                child: Row(
                  children: [
                    //Student selection box
                    Expanded(
                      child: RadioListTile(                      
                        value: 'Student',
                        onChanged: (String? value) { 
                          setState(() {
                            _role = value!;
                          });
                        },
                        groupValue: _role,
                        title: Text(
                          'Student',
                          style: TextStyle(
                            color: _role == 'Student' ? Colors.white : Colors.black,
                            fontSize: 14
                          ),
                        ),
                        tileColor: _role == 'Student' ? blue : white,
                        activeColor: Colors.white,
                        dense: true,
                        shape: RoundedRectangleBorder(
                          borderRadius: BorderRadius.circular(10),
                        ),
                      ),
                    ),
                    
                    const SizedBox(width: 15), // Spacer for spacing

                    //Teacher selection box
                    Expanded(
                      child: RadioListTile(
                        value: 'Teacher',
                        onChanged: (String? value) { 
                          setState(() {
                            _role = value!;
                          });
                        },
                        groupValue: _role,
                        title: Text(
                          'Teacher',
                          style: TextStyle(
                            color: _role == 'Teacher' ? Colors.white : Colors.black,
                            fontSize: 14
                          ),
                        ),
                        tileColor: _role == 'Teacher' ? blue : white,
                        activeColor: Colors.white,
                        dense: true,
                        shape: RoundedRectangleBorder(
                          borderRadius: BorderRadius.circular(10),
                        ),
                      ),
                    ),
                  ],
                ),
              ),

              //Spacer for spacing
              if (errorMessage.isEmpty)
                const SizedBox(height: 15),

              if (errorMessage.isEmpty)
                const SizedBox(height: 5),
                            
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


              //Register button
              SizedBox(
                width: 250,
                height: 60,
                child: ElevatedButton(
                  onPressed: () {
                    signUp(usernameController.text, passwordController.text, firstNameController.text, lastNameController.text, emailController.text, _role!.toLowerCase(), confirmPasswordController.text, context);                  
                  },
                  style: ElevatedButton.styleFrom(
                    backgroundColor: blue,                   
                    shape: RoundedRectangleBorder(
                      borderRadius: BorderRadius.circular(10),
                    ),                                
                  ),
                  child: const Text(
                    'Register',
                    style: TextStyle(
                      color: Colors.white,
                      fontWeight: FontWeight.bold,
                      fontSize: 16,
                    ),
                  ),
                ),
              ),
              
              const SizedBox(height: 50), //spacer for spacing

              //already have an account text
              Row(
                mainAxisAlignment: MainAxisAlignment.center,
                children: [
                  Text(
                    'Already have an account?',
                    style: TextStyle(color: Colors.grey.shade600),
                  ),
                  const SizedBox(width: 4,),
                  GestureDetector(
                    onTap: () => {
                      Navigator.push( //redirect
                        context,
                        MaterialPageRoute(builder: (context) => const LoginPage(success: false) )
                      )
                    },
                    child: const Text(                    
                      'Login',
                      style: TextStyle(color: Colors.blue, fontWeight: FontWeight.bold),
                    ),
                  ),
                ],
              ),

              const SizedBox(height: 10), //spacer for spacing
            ]
          )),
      )
    );
  }
}

