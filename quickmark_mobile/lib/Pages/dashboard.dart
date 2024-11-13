import 'dart:async';
import 'package:flutter/material.dart';
import 'package:flutter_randomcolor/flutter_randomcolor.dart';
import 'package:quickmark_mobile/components/side_menu.dart';
import 'package:quickmark_mobile/Pages/class_prof.dart';
import 'package:quickmark_mobile/components/add_class_popup.dart';
import 'package:quickmark_mobile/components/course_card.dart';
import 'package:quickmark_mobile/server_calls.dart';

//Color Pallete Constants
const white = Color(0xFFF7FCFF) ;
const lightBlue = Color(0xFF8DA9C4) ;
const blue = Color(0xFF134074) ;
const darkBlue = Color(0xFF13315C) ;
const navy = Color(0xFF0B2545) ;

class Dashboard extends StatefulWidget {
  final Map<String, dynamic> user;

  const Dashboard({
    super.key,
    required this.user,
  });

  @override
  State<Dashboard> createState() => _DashboardState();
}

class _DashboardState extends State<Dashboard> {
  String errorMessage = '';

  //Get Classes API
  getClasses(String login) async {

    final body = {
      'login' : login
    };

    //Make Call
    try {
      final response = await ServerCalls().post('/classes', body) as Map<String, dynamic>;
      if(response['error'] != '') {
        setState((){ //Creates the error message
          errorMessage = response['error'];
        });
      } else {
        setState((){ //Creates the error message
          errorMessage = response['error'];
        });
        List<ClassModel> classes = (response['classes'] as List)
          .map((data) => ClassModel.fromJson(data)).toList();
        return classes;
      }
    } catch (err) {
      debugPrint('Error: $err');
    }
  }

  late Future<dynamic> futureClasses;

  @override
  void initState() {
    super.initState();
    futureClasses = getClasses(widget.user['login']);
  }

  
  @override
  Widget build(BuildContext context) {
    String firstName = widget.user['firstName'];
    return Scaffold(
      backgroundColor: white,
      appBar: AppBar(
        automaticallyImplyLeading: false,
        backgroundColor: blue,
        iconTheme: const IconThemeData(color: white),
        title: Row(
          mainAxisAlignment: MainAxisAlignment.center,
          children: [
            const SizedBox(width: 20),
            Image.asset(
                    'lib/images/QM_white.png',
                    height: 60,
                  ),
            const Text(
              'QuickMark',
              style: TextStyle(
                color: white,
                fontWeight: FontWeight.bold,
              ),
            ),
          ],
        ),
      ),

      // This is the side menu
      endDrawer: SideMenu(user: widget.user),

      body: Padding(
        padding: const EdgeInsets.all(20.0),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Text(
              'Welcome back, $firstName!',
              style: const TextStyle(
                color: navy,
                fontSize: 20,
                fontWeight: FontWeight.bold,
              ),
            ),
            const Divider(
              height: 40,
              color: navy,
            ),
            Expanded(
              child: FutureBuilder<dynamic>(
                future: futureClasses,
                builder:(context, snapshot) {
                  List<ClassModel> courses = [];

                  // Show loading spinner while waiting for data
                  if (snapshot.connectionState == ConnectionState.waiting) {
                    return const Center(child: CircularProgressIndicator());
                  }
                  // If no data is available, display a placeholder message
                  if (!snapshot.hasData || snapshot.data!.isNotEmpty) {
                    courses = snapshot.data!;
                  }
                  return GridView.builder(
                  gridDelegate: const SliverGridDelegateWithFixedCrossAxisCount(
                    crossAxisCount: 2,
                    crossAxisSpacing: 20,
                    mainAxisSpacing: 20,
                  ),
                  itemCount: courses.length+1,
                  itemBuilder: (context, index) {
                    if (index < courses.length) {
                      return InkWell(
                        onTap: () => {
                          Navigator.push(
                            context,
                            MaterialPageRoute(builder: (context) => ClassProf(title: courses[index].className))
                          )
                        },
                        child: CourseCard(
                          title: courses[index].className,
                          subtitle: courses[index].joinCode,
                          color: RandomColor.getColorObject(Options(luminosity: Luminosity.light)),
                          user: widget.user,
                          classId: courses[index].id,
                        ),
                      );
                    }
                    else {
                      return InkWell(
                        onTap: () {
                          showDialog<List>(
                            context: context,
                            builder: (context) => AddClassPopup(user: widget.user),
                            barrierDismissible: true,                           
                          );
                        },
                        child: Card(
                          shape: RoundedRectangleBorder(
                            borderRadius: BorderRadius.circular(10),
                          ),
                          elevation: 10,
                          child: const Icon(Icons.add, size: 50.0),
                        ),
                      );
                    }
                  },
                  );
                },
              ),
            ),
          ],
        ),
      ),
    );
  }
}

class ClassModel {
  final String id;
  final String className;
  final String joinCode;
  final String teacherID;
  final List<dynamic> students;
  final List<dynamic> sessions;
  final int interval;

  ClassModel({
    required this.id,
    required this.className,
    required this.joinCode,
    required this.teacherID,
    required this.students,
    required this.sessions,
    required this.interval,
  });

  factory ClassModel.fromJson(Map<String, dynamic> json) {
    return ClassModel(
      id: json['_id'],
      className: json['className'],
      joinCode: json['joinCode'],
      teacherID: json['teacherID'],
      students: json['students'],
      sessions: json['sessions'],
      interval: json['interval'],
    );
  }
}