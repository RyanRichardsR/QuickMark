import 'package:flutter/material.dart';
//import 'package:quickmark_mobile/server_calls.dart';

class CourseCard extends StatefulWidget {
  final String title;
  final String subtitle;
  final Color color;
  final Map<String, dynamic> user;

  const CourseCard({
    super.key,
    required this.title,
    required this.subtitle,
    required this.color,
    required this.user,
  });

  @override
  State<CourseCard> createState() => _CourseCardState();
}

//FOR DASHBOARD MENU
//enum Menu { delete, edit }

class _CourseCardState extends State<CourseCard> {
  
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
                      Text('Class Code: ${widget.subtitle}'),
                    ],
                  ),
                ),

                //IF WE WANT TO ADD A MENU ON THE DASHBOARD
                /*Align(  
                  alignment: Alignment.topRight,
                  child: Padding(
                    padding: const EdgeInsets.only(bottom: .0, left: 16.0),
                    child: PopupMenuButton(
                      onSelected: (Menu item) {
                        switch (item) {
                          case Menu.delete:
                    
                          case Menu.edit:
                          
                        }
                      }, 
                      itemBuilder: (BuildContext context) { 
                        return <PopupMenuEntry<Menu>>[
                          const PopupMenuItem<Menu>(
                            value: Menu.delete,
                            child: ListTile(
                              leading: Icon(Icons.delete_outline),
                              title: Text('Delete'),
                            ),
                          ),
                          const PopupMenuItem<Menu>(
                            value: Menu.edit,
                            child: ListTile(
                              leading: Icon(Icons.edit),
                              title: Text('Edit'),
                            )
                          ),
                        ];
                      },
                    ),
                  ),
                ),*/
              ],
            ),
          ),
        ],
      ),
    );
  }
}