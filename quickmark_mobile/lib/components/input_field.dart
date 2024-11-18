import 'package:flutter/material.dart';

class textField extends StatefulWidget {
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
  State<textField> createState() => _textFieldState();
}

class _textFieldState extends State<textField> {
  late bool passwordVisible;
  @override
  void initState() {
    super.initState();
    passwordVisible = !widget.obscureText;
  }

  @override
  Widget build(BuildContext context) {
    return Padding(
      padding: EdgeInsets.symmetric(horizontal: widget.paddingHorizontal),
      child: TextField(
        controller: widget.input,
        obscureText: !passwordVisible,
        decoration: InputDecoration(
          enabledBorder: const OutlineInputBorder(
            borderSide: BorderSide(color: Colors.grey),
          ),
          focusedBorder: const OutlineInputBorder(
            borderSide: BorderSide(color: Colors.black),
          ),
          fillColor: Colors.white,
          filled: true,
          hintText: widget.hintText,
          hintStyle: TextStyle(color: Colors.grey.shade500),
          suffixIcon: widget.obscureText ? IconButton(
            icon: Icon(
              passwordVisible ? Icons.visibility : Icons.visibility_off,
              color: Colors.black,
            ),
            onPressed: () {
              setState(() {
                passwordVisible = !passwordVisible;
              });
            }, 
          ): null,
        ) 
      ),
    );
  }
}