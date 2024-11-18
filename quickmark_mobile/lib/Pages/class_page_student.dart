import 'package:flutter/material.dart';
import 'package:intl/intl.dart';
import 'package:quickmark_mobile/components/scan_buttons.dart';
import 'package:quickmark_mobile/components/side_menu.dart';
import 'package:quickmark_mobile/server_calls.dart';

//Color Pallete Constants
const white = Color(0xFFF7FCFF) ;
const lightBlue = Color(0xFF8DA9C4) ;
const blue = Color(0xFF134074) ;
const darkBlue = Color(0xFF13315C) ;
const navy = Color(0xFF0B2545) ;

class ClassPageStudent extends StatefulWidget {
  final String classId;
  final Map<String, dynamic> user;

  const ClassPageStudent({super.key, required this.classId, required this.user});

  @override
  State<ClassPageStudent> createState() => _ClassPageStudentState();
}

class _ClassPageStudentState extends State<ClassPageStudent> {
  late Future<Map<String, dynamic>> classInfo;

  @override
  void initState() {
    super.initState();
    classInfo = classInfoApiCall(widget.classId, widget.user['id']);
  }

  // make classInfoStudent api call
  Future<Map<String, dynamic>> classInfoApiCall(String classId, String userId) async {
    Map<String, dynamic> classInfo = {};

    final body = {
      'classId' : classId,
      'userId' : userId,
    };

    try {
      var response = await ServerCalls().post('/classInfoStudent', body);
      if(response['error'] != null) {
        debugPrint('Error: $response');
      } else {
        classInfo = response;
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
          content: const Text('This will take you out of the session!'),
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
    return FutureBuilder<Map<String, dynamic>>(
      future: classInfo,
      builder: (context, snapshot) {
        if (snapshot.connectionState == ConnectionState.waiting) {
          return const Scaffold(
            body: Center(child: CircularProgressIndicator())
          );
        }
        else if (snapshot.hasData) {
          return PopScope(
            canPop: !snapshot.data!['latestSessionIsRunning'],
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
                        snapshot.data!['teacherLastName'], // Replace with actual code
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
                        // Check if there is an active class session
                        child: snapshot.data!['latestSessionIsRunning'] ? ScanButtons(
                          attendReq: 
                          {
                            'sessionId' : snapshot.data!['attendanceData'].last['sessionId'],
                            'userId' : widget.classId
                          },
                        ) :
                        Center(child: Text('No active class session')),
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
                          child: snapshot.data!['attendanceData'].length > 0 ?
                            HistoryTableStudent(attendanceData: snapshot.data!['attendanceData'], isRunning: snapshot.data!['latestSessionIsRunning']) :
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

class HistoryTableStudent extends StatelessWidget {
  final List<dynamic> attendanceData;
  final bool isRunning;
  const HistoryTableStudent({super.key, required this.attendanceData, required this.isRunning});

  String _formatDateTime(int index) {
    // Reverse the list
    if (attendanceData[index]['startTime'] == null || attendanceData[index]['endTime'] == null) return 'Invalid Date';
    DateTime startTime = DateTime.parse(attendanceData[index]['startTime']).toLocal();
    DateTime endTime = DateTime.parse(attendanceData[index]['endTime']).toLocal();
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
        itemCount: isRunning ? attendanceData.length-1 : attendanceData.length, // Do not print the last session if it is still running
        itemBuilder: (context, index) {
          return Container(
            padding: EdgeInsets.only(left: 8.0, right: 8.0),
            height: 30.0,
            child: Row(
              mainAxisAlignment: MainAxisAlignment.spaceBetween,
              children: [
                Text(_formatDateTime(index)),
                attendanceData[index]['attendanceGrade'] ?
                  Text('Present', style: TextStyle(color: Colors.green, fontWeight: FontWeight.bold)) :
                  Text('Absent', style: TextStyle(color: Colors.red, fontWeight: FontWeight.bold))
              ],
            ),
          );
        },
      ),
    );
  }
}