import 'package:flutter/material.dart';
import 'package:quickmark_mobile/components/input_field.dart';

//Color Pallete Constants
const white = Color(0xFFF7FCFF) ;
const lightBlue = Color(0xFF8DA9C4) ;
const blue = Color(0xFF134074) ;
const darkBlue = Color(0xFF13315C) ;
const navy = Color(0xFF0B2545) ;

class AddClassPopup extends StatelessWidget {

  final bool isTeacher;

  AddClassPopup({
    super.key,
    required this.isTeacher,
  });

  final inputController = TextEditingController();

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
            input: inputController,
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
              Navigator.of(context).pop([]);
            },
            child: Text(isTeacher ? 'Create' : 'Join', style: const TextStyle(color: Colors.white)),
          ),
        ],
      ),
    );
  }
}