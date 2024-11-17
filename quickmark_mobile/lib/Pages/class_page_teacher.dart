import 'package:flutter/material.dart';
import 'package:intl/intl.dart';
import 'package:quickmark_mobile/components/advertise_buttons.dart';
import 'package:quickmark_mobile/components/side_menu.dart';
import 'package:quickmark_mobile/server_calls.dart';

//Color Pallete Constants
const white = Color(0xFFF7FCFF) ;
const lightBlue = Color(0xFF8DA9C4) ;
const blue = Color(0xFF134074) ;
const darkBlue = Color(0xFF13315C) ;
const navy = Color(0xFF0B2545) ;

class ClassPageTeacher extends StatefulWidget {
  final String classId;
  final Map<String, dynamic> user;

  const ClassPageTeacher({super.key, required this.classId, required this.user});

  @override
  State<ClassPageTeacher> createState() => _ClassPageTeacherState();
}

class _ClassPageTeacherState extends State<ClassPageTeacher> {
  late Future<Map<String, dynamic>> classInfo;

  @override
  void initState() {
    super.initState();
    classInfo = classInfoApiCall(widget.classId, widget.user['id']);
  }

  // make classInfoTeacher api call
  Future<Map<String, dynamic>> classInfoApiCall(String classId, String userId) async {
    Map<String, dynamic> classInfo = {};
    final body = {
      '_id' : classId,
    };
    try {
      var response = await ServerCalls().post('/classInfoTeacher', body);
      if(response['error'] != '') {
        debugPrint('Error: ${response['error']}');
      } else {
        classInfo = response['classInfo'];
      }
    } catch (err) {
      debugPrint('Error: $err');
    }
    return classInfo;
  }

  // Confirm exit dialog
  Future<bool?> _showBackDialog() {
    return showDialog<bool>(
      context: context,
      builder: ((context) {
        return AlertDialog(
          title: const Text('Are you sure?'),
          content: const Text('Any ongoing session will end!'),
          actions: [
            TextButton(
              onPressed: () {
                Navigator.pop(context, false);
              },
              child: const Text('Cancel')
            ),
            TextButton(
              onPressed: () {
                Navigator.pop(context, true);
              },
              child: const Text('Quit')
            ),
          ],
        );
      })
    );
  }

  @override
  Widget build(BuildContext context) {
    return FutureBuilder(
      future: classInfo,
      builder: (context, snapshot) {
        if (snapshot.connectionState == ConnectionState.waiting) {
          return const Scaffold(
            body: Center(child: CircularProgressIndicator())
          );
        }
        else if (snapshot.hasData) {
          return PopScope(
            canPop: false,
            onPopInvokedWithResult: (didPop, result) async {
              if (didPop) {
                return;
              }
              final bool shouldPop = await _showBackDialog() ?? false;
              if (context.mounted && shouldPop) {
                Navigator.pop(context);
              }
            },
          
          child: Scaffold(
            appBar: AppBar(
              backgroundColor: blue,
              iconTheme: const IconThemeData(color: white),
              title: Row(
                mainAxisAlignment: MainAxisAlignment.center,
                children: [
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
                  const SizedBox(width: 50)
                ],
              ),
            ),
            endDrawer: SideMenu(user: widget.user),
            body: Container(
              padding: const EdgeInsets.all(20.0),
              decoration: const BoxDecoration(
                gradient: LinearGradient(begin: Alignment.bottomRight, colors: [blue, white])
              ),
              child: Center(
                child: Column(
                  mainAxisAlignment: MainAxisAlignment.start,
                  crossAxisAlignment: CrossAxisAlignment.stretch,
                  children: [
                    Text(
                      snapshot.data!['className'], // Replace with actual name
                      style: TextStyle(
                        color: navy,
                        fontSize: 25,
                        fontWeight: FontWeight.bold,
                      ),
                    ),
                    Text(
                      'Join Code: ${snapshot.data!['joinCode']}', // Replace with actual code
                      style: TextStyle(
                        color: navy,
                        fontSize: 18,
                        fontWeight: FontWeight.bold,
                      ),
                    ),
                    

                    const Divider(
                      height: 40,
                      color: navy,
                    ),
                    SizedBox(
                      height: 180,
                      child: AdvertiseButtons(classId: widget.classId)
                    ),

                    const Divider(
                      height: 40,
                      color: navy,
                    ),

                    const Text(
                      'History',
                      style: TextStyle(
                        color: navy,
                        fontSize: 25,
                        fontWeight: FontWeight.bold,
                      ),
                    ),
                    Expanded(
                      child: Container(
                        decoration: BoxDecoration(
                          color: white,
                          border: Border.all(color: navy),
                          borderRadius: BorderRadius.all(Radius.circular(4)),
                        ),
                        child: snapshot.data!['sessions'].length > 0 ?
                          HistoryTableTeacher(sessions : snapshot.data!['sessions'], students: snapshot.data!['students']) :
                          Center(child: Text('So empty...')),
                      ),
                    ),
                  ],
                ),
              ),
            ),
          ),
          );
        }
        else {
          throw Exception(snapshot.error);
        }
      }
    );
  }
}

class HistoryTableTeacher extends StatelessWidget {
  final List<dynamic> sessions;
  final List<dynamic> students;
  const HistoryTableTeacher({super.key, required this.sessions, required this.students});

  String _formatDateTime(int index) {
    // Reverse the list
    if (sessions[index]['startTime'] == null || sessions[index]['endTime'] == null) return 'Invalid Date';
    DateTime startTime = DateTime.parse(sessions[index]['startTime']).toLocal();
    DateTime endTime = DateTime.parse(sessions[index]['endTime']).toLocal();
    var dateFormat = DateFormat('MM/dd/yyyy');
    var timeFormat = DateFormat.jm();
    return '${dateFormat.format(startTime)} - ${timeFormat.format(startTime)} to ${timeFormat.format(endTime)}';
  }

  @override
  Widget build(BuildContext context) {
    return Scrollbar(
      child: ListView.separated(
        padding: EdgeInsets.all(8.0),
        separatorBuilder: (context, index) => Divider(),
        itemCount: sessions.length,
        itemBuilder: (context, index) {
          return ElevatedButton(
            style: ElevatedButton.styleFrom(
              foregroundColor: navy,
              backgroundColor: white,
              padding: EdgeInsets.all(16),
              shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(4))
            ),
            onPressed: () {
              showDialog(
                context: context,
                builder: (context) => StudentGradeTable(sessionStudents: sessions[index]['students'], students: students),
              );
            },
            child: Row(
              mainAxisAlignment: MainAxisAlignment.spaceBetween,
              children: [
                Text(_formatDateTime(index)),
                Icon(Icons.arrow_forward_ios)
              ],
            ),
          );
        }
      ),
    );
  }
}

class StudentGradeTable extends StatefulWidget {
  final List<dynamic> sessionStudents;
  final List<dynamic> students;
  const StudentGradeTable({super.key, required this.sessionStudents, required this.students});

  @override
  State<StudentGradeTable> createState() => _StudentGradeTableState();
}

class _StudentGradeTableState extends State<StudentGradeTable> {
  late Future<List<dynamic>> studentNames;

  @override
  void initState() {
    super.initState();

    // Transform userIds to names
    studentNames = namesByIdsApiCall(widget.students);
  }

  // make getUsersByIds api call
  Future<List<dynamic>> namesByIdsApiCall(userIds) async {
    List<dynamic> names = [];

    final body = {
      'userIds' : userIds,
    };
    try {
      var response = await ServerCalls().post('/getUsersByIds', body);
      if(response['error'] != '') {
        debugPrint('Error: ${response['error']}');
      } else {
        names = response['users'];
      }
    } catch (err) {
      debugPrint('Error: $err');
    }
    return names;
  }

  @override
  Widget build(BuildContext context) {
    return Dialog(
      backgroundColor: white,
      shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(5)),
      child: SizedBox(
        height: 500,
        child: FutureBuilder(
          future: studentNames,
          builder: (context, snapshot) {
            if (snapshot.connectionState == ConnectionState.waiting) {
              return const Scaffold(
                body: Center(child: CircularProgressIndicator())
              );
            }
            else if (snapshot.hasData) {

              // Get attendance for students in class and fill in missing students with Absent
              Map<String, bool> sessionStudentMap = {
                for (var student in widget.sessionStudents) student['userId']: student['attendanceGrade']
              };
              List<bool> attendance = widget.students.map((id) {
                if (!sessionStudentMap.containsKey(id) || sessionStudentMap[id] == false) {
                  return false;
                } else {
                  return true;
                }
              }).toList();

              return Padding(
                padding: const EdgeInsets.all(8.0),
                child: Column(
                  children: [
                    Text(
                      'Student Grades',
                      style: TextStyle(
                        color: navy,
                        fontSize: 20,
                        fontWeight: FontWeight.bold,
                      ),
                    ),

                    // Student grade table
                    Expanded(
                      child: Container(
                        decoration: BoxDecoration(
                          border: Border.all(color: navy),
                          borderRadius: BorderRadius.circular(4),
                        ),
                        child: Scrollbar(
                          child: ListView.separated(
                            padding: EdgeInsets.all(8.0),
                            separatorBuilder: (context, index) => Divider(),
                            itemCount: widget.students.length,
                            itemBuilder: (context, index) {
                              return Container(
                                padding: EdgeInsets.only(left: 8.0, right: 8.0),
                                height: 30.0,
                                child: Row(
                                  mainAxisAlignment: MainAxisAlignment.spaceBetween,
                                  children: [
                                    Text('${snapshot.data![index]['firstName']} ${snapshot.data![index]['lastName']}'),
                                    attendance[index] ?
                                      Text('Present', style: TextStyle(color: Colors.green, fontWeight: FontWeight.bold)) :
                                      Text('Absent', style: TextStyle(color: Colors.red, fontWeight: FontWeight.bold))
                                  ],
                                ),
                              );
                            },
                          ),
                        ),
                      ),
                    ),
                  ],
                ),
              );
            }
            else {
              throw Exception(snapshot.error);
            }
          },
        )
      ),
    );
  }
}