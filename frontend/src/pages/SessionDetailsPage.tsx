import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Header from "../components/Header";
import SideBar from "../components/SideBar";
import "../styles/SessionDetailsPage.css";
import {  } from "../config";

const SessionDetailsPage: React.FC = () => {
  const navigate = useNavigate();
  const { sessionId, classId } = useParams<{ sessionId: string; classId: string }>();
  const [students, setStudents] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>("");

  useEffect(() => {
    const fetchSessionAndClassInfo = async () => {
      try {
        setLoading(true);

        if (!classId || !sessionId) {
          setError("Session ID or Class ID is missing.");
          return;
        }

        // Fetch class data to get the student ObjectIds
        const classResponse = await fetch(`http://cop4331.xyz/api/classInfoTeacher`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ _id: classId }),
        });
        const classData = await classResponse.json();

        if (classData.error) throw new Error(classData.error);

        const studentIds = classData.classInfo?.students || [];

        // Fetch student names using the /api/getUsersByIds endpoint
        const namesResponse = await fetch(`http://cop4331.xyz/api/getUsersByIds`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ userIds: studentIds }),
        });
        const namesData = await namesResponse.json();

        if (namesData.error) throw new Error(namesData.error);

        // Create a map of user IDs to names
        const namesMap = namesData.users.reduce((acc: any, user: any) => {
          acc[user._id] = `${user.firstName} ${user.lastName}`;
          return acc;
        }, {});

        // Fetch session data for attendance information
        const sessionResponse = await fetch(`http://cop4331.xyz/api/getSessionInfo`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ sessionId }),
        });
        const sessionData = await sessionResponse.json();

        if (sessionData.error) throw new Error(sessionData.error);

        // Check if `sessionData.student` exists and is an array
        const sessionStudents = sessionData.students || [];

        // Map through the class students and update their attendance based on session data
        const updatedStudents = studentIds.map((studentId: any) => {
          const sessionStudent = sessionStudents.find((s: any) => s.userId === studentId);
          const attendanceStatus = sessionStudent
            ? sessionStudent.attendanceGrade
              ? "Present"
              : "Absent"
            : "Absent";

          return {
            _id: studentId,
            name: namesMap[studentId] || "Unknown Name", // Get the name from the namesMap
            attendanceStatus,
          };
        });

        setStudents(updatedStudents);
        console.log("Updated Students with Attendance Status:", updatedStudents);
      } catch (err: any) {
        console.error("Error:", err.message || "Failed to fetch session details.");
        setError(err.message || "Failed to fetch session details.");
      } finally {
        setLoading(false);
      }
    };

    fetchSessionAndClassInfo();
  }, [classId, sessionId]);

  const handleExportToCSV = () => {
    const csvContent = [
      ["Student ID", "Name", "Attendance Status"], // Header row
      ...students.map((student) => [
        student._id,
        student.name,
        student.attendanceStatus,
      ]),
    ]
      .map((row) => row.join(","))
      .join("\n");

    const blob = new Blob([csvContent], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `session_${sessionId}_attendance.csv`;
    link.click();
    window.URL.revokeObjectURL(url);
  };

  return (
    <div className="session-details-page">
      <Header />
      <SideBar />
      <div className="session-content">
        <div className="breadcrumb" onClick={() => navigate(-1)}>
          &lt; Back to Sessions
        </div>

        <div className="session-header">
          <div>
            <h2 className="session-title">Session Details</h2>
            <p className="session-subtitle">Attendance Record</p>
          </div>
          <button className="export-button" onClick={handleExportToCSV}>
            Export to CSV
          </button>
        </div>

        <div className="students-table">
          {loading ? (
            <p>Loading student attendance...</p>
          ) : error ? (
            <p className="error-message">{error}</p>
          ) : students.length > 0 ? (
            students.map((student) => (
              <div key={student._id} className="student-row">
                <span>{student.name}</span>
                <span className={`attendance-status ${student.attendanceStatus.toLowerCase()}`}>
                  {student.attendanceStatus}
                </span>
              </div>
            ))
          ) : (
            <p className="no-students-message">No students found for this session.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default SessionDetailsPage;
