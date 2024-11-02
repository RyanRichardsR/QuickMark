import 'package:flutter/material.dart';

class PasswordRequirements extends StatelessWidget {
  final String label;
  final bool isMet;
  const PasswordRequirements({
    super.key,
    required this.label,
    required this.isMet,
  });

  @override
  Widget build(BuildContext context) {
    return Row(
      children: [
        // Check Circle
        Container(
          width: 11,
          height: 11,
          margin: const EdgeInsets.only(right: 4),
          decoration: BoxDecoration(
            shape: BoxShape.circle,
            border: Border.all(
              color: Colors.grey,
              width: 1,
            ),
            color: isMet ? Colors.green : const Color.fromARGB(0, 0, 0, 0),
            
          ),
        ),
        Text(
          label,
          textAlign: TextAlign.center,
          style: const TextStyle(
            fontSize: 11,
            height: 1.0,
          ),
        ),
      ],
    );
  }
}