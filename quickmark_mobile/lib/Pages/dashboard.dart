import 'package:flutter/material.dart';
import 'package:quickmark_mobile/components/side_menu.dart';
import 'package:quickmark_mobile/Pages/class_prof.dart';
import 'package:quickmark_mobile/components/add_class_popup.dart';
import 'package:quickmark_mobile/components/course_card.dart';

//Color Pallete Constants
const white = Color(0xFFF7FCFF) ;
const lightBlue = Color(0xFF8DA9C4) ;
const blue = Color(0xFF134074) ;
const darkBlue = Color(0xFF13315C) ;
const navy = Color(0xFF0B2545) ;


class Dashboard extends StatelessWidget {

  final Map<String, dynamic> user;

  Dashboard({
    super.key,
    required this.user,
  });

  final List<Map<String, String>> courses = [
    {
      'title': 'COP4331C',
      'subtitle': '24Fall 0001',
      'color': '0xFF4B5B40',
    },
    {
      'title': 'COP4331C',
      'subtitle': '24Fall 0002',
      'color': '0xFF394949',
    },
    {
      'title': 'COP4331C',
      'subtitle': '24Fall 0003',
      'color': '0xFF4B5B40',
    },
    {
      'title': 'COP4331C',
      'subtitle': '24Fall 0004',
      'color': '0xFF5B4656',
    },
  ];
  
  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: white,
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
            //const SizedBox(width: 10)
          ],
        ),
      ),

      // This is the side menu
      endDrawer: SideMenu(name: user["firstName"]),

      body: Padding(
        padding: const EdgeInsets.all(20.0),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            const Text(
              'Dashboard',
              style: TextStyle(
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
              child: GridView.builder(
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
                          MaterialPageRoute(builder: (context) => ClassProf(title: '${courses[index]['title']}'))
                        )
                      },
                      child: CourseCard(
                        title: courses[index]['title']!,
                        subtitle: courses[index]['subtitle']!,
                        color: courses[index]['color']!,
                      ),
                    );
                  }
                  else {
                    return InkWell(
                      onTap: () {
                        showDialog<List>(
                          context: context,
                          builder: (context) => AddClassPopup(isTeacher: false,),
                          barrierDismissible: false,
                          
                        );
                      },
                      child: Card(
                        shape: RoundedRectangleBorder(
                          borderRadius: BorderRadius.circular(10),
                        ),
                        elevation: 10,
                        child: const Icon(Icons.add, size: 50.0),
                      )
                    );
                  }
                },
              ),
            ),
          ],
        ),
      ),
    );
  }
}