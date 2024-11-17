import 'package:flutter/material.dart';
import 'package:quickmark_mobile/Pages/dashboard.dart';
import 'package:quickmark_mobile/server_calls.dart';

class CourseCard extends StatefulWidget {
  final String title;
  final String subtitle;
  final Color color;
  final Map<String, dynamic> user;
  final String classId;

  const CourseCard({
    super.key,
    required this.title,
    required this.subtitle,
    required this.color,
    required this.user,
    required this.classId,
  });

  @override
  State<CourseCard> createState() => _CourseCardState();
}

enum Menu { delete }

class _CourseCardState extends State<CourseCard> {
  late bool isTeacher;
  String errorMessage = '';

  @override
  void initState() {
    super.initState();
    isTeacher = widget.user['role'].toLowerCase().contains('teacher');
  }

  //Leave Class API
  void leaveClass(String stuId, String classId, context) async {

    final body = {
      'studentObjectId' : stuId,
      'classObjectId' : classId,
    };

    //Make Call
    try {
      final response = await ServerCalls().post('/leaveClass', body);
      if(response['error'] != '') {
        setState((){ //Creates the error message
          errorMessage = response['error'];
          debugPrint(errorMessage);
        });
      } else {
        setState((){ //Creates the error message
          errorMessage = response['error'];
        });
        Navigator.pushReplacement( //Redirect to the Dashboard
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

  void deleteClass(String classId, context) async {

    final body = {
      'classObjectId' : classId,
    };

    //Make Call
    try {
      final response = await ServerCalls().post('/deleteClass', body);
      if(response['error'] != '') {
        setState((){ //Creates the error message
          errorMessage = response['error'];
          debugPrint(errorMessage);
        });
      } else {
        setState((){ //Creates the error message
          errorMessage = response['error'];
        });
        Navigator.pushReplacement( //Redirect to the Dashboard
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
    return Card(
      shape: RoundedRectangleBorder(
        borderRadius: BorderRadius.circular(10),
      ),
      elevation: 10,
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Container(
            decoration: BoxDecoration(
              borderRadius: const BorderRadius.only(topLeft: Radius.circular(10), topRight: Radius.circular(10)),
              color: widget.color,
            ),
            height: 80,
          ),
          Padding(
            padding: const EdgeInsets.only(left: 10.0, top: 10.0),
            child: Row(
              children: [
                Expanded(
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Text(
                        widget.title,
                        style: const TextStyle(fontWeight: FontWeight.bold,)
                      ),
                      Text('Code: ${widget.subtitle}'),
                    ],
                  ),
                ),

                //IF WE WANT TO ADD A MENU ON THE DASHBOARD
                Align(  
                  alignment: Alignment.topRight,
                  child: Padding(
                    padding: const EdgeInsets.only(bottom: .0, left: 16.0),
                    child: PopupMenuButton(
                      onSelected: (Menu item) {
                        switch (item) {
                          case Menu.delete:
                            isTeacher ? deleteClass(widget.classId, context) : leaveClass(widget.user['id'], widget.classId, context);    
                        }
                      }, 
                      itemBuilder: (BuildContext context) { 
                        return <PopupMenuEntry<Menu>>[
                          PopupMenuItem<Menu>(
                            value: Menu.delete,
                            child: ListTile(
                              leading:isTeacher ? const Icon(Icons.delete_outline) : const Icon(Icons.exit_to_app),
                              title: Text(isTeacher ? 'Delete' : 'Leave'),
                            ),
                          )
                        ];
                      },
                    ),
                  ),
                ),
              ],
            ),
          ),
        ],
      ),
    );
  }
}