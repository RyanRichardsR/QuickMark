import 'package:flutter/material.dart';
//import 'package:mobile/class_prof.dart';

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
      appBar: AppBar(
        title: const Text(
          'Dashboard',
          style: TextStyle(
            color: Colors.white,
            fontWeight: FontWeight.bold,
          ),
        ),
        backgroundColor: Color(int.parse('0xFF0B2545')),
      ),
      body: Padding(
        padding: const EdgeInsets.all(20.0),
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
                onTap: () => {
                  print('tapped +')
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
    );
  }

  void tapped(TapUpDetails details) {
  }
}

ClassProf({required String title}) {
}

class CourseCard extends StatelessWidget {

  final String title;
  final String subtitle;
  final String color;

  const CourseCard({
    super.key,
    required this.title,
    required this.subtitle,
    required this.color,
  });

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
              color: Color(int.parse(color)),
            ),
            height: 80,
          ),
          Padding(
            padding: const EdgeInsets.all(10.0),
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text(title),
                Text(subtitle),
              ],
            ),
          ),
        ],
      ),
    );
  }
}