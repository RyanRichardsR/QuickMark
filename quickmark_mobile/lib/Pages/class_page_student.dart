import 'package:flutter/material.dart';
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

  late Future<String> sessionId;

  @override
  void initState() {
    super.initState();
    sessionId = classInfoApiCall();
  }

  // Makeshift classinfo api call to get last session
  Future<String> classInfoApiCall() async {

    String sessionId = "";

    // Hard coded for now
    final body = {
      'classId' : '67279b0b5cc76a6d07cec574',
      'userId' : '672293bfa372eeb9194679d2',
    };
    // Create session api call
    try {
      var response = await ServerCalls().post('/classInfoStudent', body);
      if(response['error'] != null) {
        debugPrint('Error: $response');
      } else {
        final attentdanceData = response['attendanceData'] as List;
        sessionId = attentdanceData.last['sessionId'];
      }
    } catch (err) {
      debugPrint('Error: $err');
    }
    return sessionId;
  }

  @override
  Widget build(BuildContext context) {
    return FutureBuilder<String?>(
      future: sessionId,
      builder: (context, snapshot) {
        if (snapshot.connectionState == ConnectionState.waiting) {
          return const Scaffold(
            body: Center(child: CircularProgressIndicator())
          );
        }
        else if (snapshot.hasData && snapshot.data != null) {
          return Scaffold(
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
              const Text(
                  'Class Name', // Replace with actual name
                    style: TextStyle(
                      color: navy,
                      fontSize: 25,
                      fontWeight: FontWeight.bold,
                    ),
                  ),
              const Text(
                'Join Code: thisisjoincode', // Replace with actual code
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
              ScanButtons(
                attendReq: 
                {
                  'sessionId' : snapshot.data,
                  'userId' : '672293bfa372eeb9194679d2'
                },
              ),  // TODO: Replace with actual info

              const Divider(
                height: 40,
                color: navy,
              ),

              const Text(
                'History', // Replace with actual name
                style: TextStyle(
                  color: navy,
                  fontSize: 25,
                  fontWeight: FontWeight.bold,
                ),
              ),

              const Expanded(
                child: SingleChildScrollView(
                  child:
                    HistoryTable(sessionInfos: [])
                  ,
                ),
              ),
            ],
          ),
        ),
      ),
    );
        }
        else {
          throw Exception('Some error');
        }

      }
    );
    /*
    Scaffold(
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
      endDrawer: const SideMenu(name: 'name', role: 'role'),
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
              const Text(
                  'Class Name', // Replace with actual name
                    style: TextStyle(
                      color: navy,
                      fontSize: 25,
                      fontWeight: FontWeight.bold,
                    ),
                  ),
              const Text(
                'Join Code: thisisjoincode', // Replace with actual code
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
              ScanButtons(
                attendReq: 
                {
                  'sesionId' : sessionId,
                  'userId' : '672293bfa372eeb9194679d2'
                },
              ),  // TODO: Replace with actual info

              const Divider(
                height: 40,
                color: navy,
              ),

              const Text(
                'History', // Replace with actual name
                style: TextStyle(
                  color: navy,
                  fontSize: 25,
                  fontWeight: FontWeight.bold,
                ),
              ),

              const Expanded(
                child: SingleChildScrollView(
                  child:
                    HistoryTable(sessionInfos: [])
                  ,
                ),
              ),
            ],
          ),
        ),
      ),
    );
    */
  }
}

class HistoryTable extends StatelessWidget {
  final List<dynamic> sessionInfos;
  const HistoryTable({super.key, required this.sessionInfos});
  
  @override
  Widget build(BuildContext context) {
    return DataTable(
      border: TableBorder.all(),
      dataTextStyle: const TextStyle(color: navy),
      dataRowColor: const WidgetStatePropertyAll(Colors.white),
      dataRowMinHeight: 40,
      dataRowMaxHeight: 40,
      headingTextStyle: const TextStyle(color: Colors.white),
      headingRowColor: const WidgetStatePropertyAll(navy),
      headingRowHeight: 40,
      columns: const [
        DataColumn(
          label: Expanded(
            child: Text('Date'),
          ),
        ),
        DataColumn(
          label: Expanded(
            child: Text('Start'),
          ),
        ),
        DataColumn(
          label: Expanded(
            child: Text('End'),
          ),
        ),
        DataColumn(
          label: Expanded(
            child: Text('Signals'),
          ),
        ),
      ],

      rows: List.generate(
        20,
        (index) => DataRow(
          color: WidgetStatePropertyAll((index % 2 == 0) ? white : lightBlue),
          cells: [
            DataCell(Text('$index')),
            DataCell(Text('$index')),
            DataCell(Text('$index')),
            DataCell(Text('$index')),
          ],
        ),
      ),
    );
  }
}