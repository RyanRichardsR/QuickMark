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