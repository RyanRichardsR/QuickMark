import 'package:flutter/material.dart';
import 'package:quickmark_mobile/Pages/dashboard.dart';
import 'package:quickmark_mobile/components/input_field.dart';
import 'package:quickmark_mobile/server_calls.dart';
import 'dart:math';

//Color Pallete Constants
const white = Color(0xFFF7FCFF) ;
const lightBlue = Color(0xFF8DA9C4) ;
const blue = Color(0xFF134074) ;
const darkBlue = Color(0xFF13315C) ;
const navy = Color(0xFF0B2545) ;


class AddClassPopup extends StatefulWidget {
  final Map<String, dynamic> user;

  const AddClassPopup({
    super.key,
    required this.user,
  });
  

  @override
  State<AddClassPopup> createState() => _AddClassPopupState();
}

class _AddClassPopupState extends State<AddClassPopup> {
  late bool isTeacher;
  final classNameController = TextEditingController();
  String errorMessage = '';

  @override
  void initState() {
    super.initState();
    isTeacher = widget.user['role'].toLowerCase().contains('teacher');
  }

  //add class for student
  void addClassStudent(String joinCode, String studentId, context) async {
    //Json data
    final body = {
      'studentObjectId' : studentId,
      'joinCode': joinCode,
    };
    
    //Make API call
    try {
      var response = await ServerCalls().post('/joinClass', body);
      if(response['error'] != '') {
        setState((){ //Creates the error message
          errorMessage = response['error'];
        });
      } else { 
        setState((){ //Reset Error message
          errorMessage = response['error'];
        });
        Navigator.push( //Redirect to the Dashboard
          context,
          MaterialPageRoute(
            builder: (context) => Dashboard(user : widget.user),
          ),
        );
      }
    } catch (err) {
      debugPrint('Error: $err');
    }
  }
  
  //add class for teacher
  void addClassTeacher(String className, String joinCode, String teacherId, context) async {
    //Json data
    final body = {
      'className': className,
      'joinCode': joinCode,
      'teacherID': teacherId,
    };
    
    //Make API call
    try {
      var response = await ServerCalls().post('/createClass', body);
      if(response['error'] != '') {
        setState((){ //Creates the error message
          errorMessage = response['error'];
        });
      } else { 
        setState((){ //Reset Error message
          errorMessage = response['error'];
        });
        Navigator.push( //Redirect to the Dashboard
          context,
          MaterialPageRoute(
            builder: (context) => Dashboard(user : widget.user),
          ),
        );
      }
    } catch (err) {
      debugPrint('Error: $err');
    }
  }
  
  @override
  Widget build(BuildContext context) {
    return AlertDialog(
      titlePadding: EdgeInsets.zero,
      title: Container(
        alignment: Alignment.center,
        decoration: const BoxDecoration(
          borderRadius: BorderRadius.only(topLeft: Radius.circular(10), topRight: Radius.circular(10)),
          color: blue,
        ),
        height: 60,
        child: Text(
          isTeacher ? 'Create Class': 'Join Class',
          style: const TextStyle(
            color: Colors.white,
            fontSize: 20.0,
            fontWeight: FontWeight.bold,
          ),
        ),
      ),

      shape: const RoundedRectangleBorder(
        borderRadius: BorderRadius.all(Radius.circular(10)),
      ),
      
      backgroundColor: white,
      contentPadding: const EdgeInsets.all(16.0),
      content: Column(
        mainAxisSize: MainAxisSize.min,
        children: [
          const SizedBox(height: 10),

          textField(
            input: classNameController,
            hintText: isTeacher ? "Class Name" : "Class Code",
            obscureText: false,
          ),

          const SizedBox(height: 5),
          isTeacher ? const Text('Unique class code will be generated') : const Text('Ask your instructor for the class code'),
          
          const SizedBox(height: 10),
          ElevatedButton(
            style: ElevatedButton.styleFrom(
                    backgroundColor: blue,                   
                    shape: RoundedRectangleBorder(
                      borderRadius: BorderRadius.circular(10),
                    ),
                  ),
            onPressed: () {
              if (isTeacher){
                addClassTeacher(classNameController.text, (Random().nextInt(999999)).toString(), widget.user['id'], context);
              } else {
                addClassStudent(classNameController.text, widget.user['id'], context);
              }
            },
            child: Text(isTeacher ? 'Create' : 'Join', style: const TextStyle(color: Colors.white)),
          ),
        ],
      ),
    );
  }
}