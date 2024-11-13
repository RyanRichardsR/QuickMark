import 'package:flutter/material.dart';

class textField extends StatelessWidget {
  final input;
  final String hintText;
  final bool obscureText;
  final double paddingHorizontal;

  const textField({
    super.key, 
    required this.input, 
    required this.hintText, 
    required this.obscureText, 
    required this.paddingHorizontal,
    });

  @override
  Widget build(BuildContext context) {
    return Padding(
      padding: EdgeInsets.symmetric(horizontal: paddingHorizontal),
      child: TextField(
        controller: input,
        obscureText: obscureText,
        decoration: InputDecoration(
          enabledBorder: const OutlineInputBorder(
            borderSide: BorderSide(color: Colors.grey),
          ),
          focusedBorder: const OutlineInputBorder(
            borderSide: BorderSide(color: Colors.black),
          ),
          fillColor: Colors.white,
          filled: true,
          hintText: hintText,
          hintStyle: TextStyle(color: Colors.grey.shade500),
        ),
      ),
    );
  }
}