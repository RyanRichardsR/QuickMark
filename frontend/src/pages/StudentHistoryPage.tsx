import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Header from "../components/Header";
import SideBar from "../components/SideBar";
import "../styles/StudentHistoryPage.css";
import { SERVER_BASE_URL } from "../config";

const StudentHistoryPage: React.FC = () => {
  const navigate = useNavigate();
  const { classId } = useParams<{ classId: string }>();
  const [sessions, setSessions] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>("");
  const [className, setClassName] = useState<string>("");
  const studentId =
    JSON.parse(localStorage.getItem("user_data") || "{}").id || ""; // Retrieve studentId from local storage
  console.log("Student ID from localStorage:", studentId);

  useEffect(() => {
    const fetchClassAndSessionInfo = async () => {
      try {
        setLoading(true);

        // Fetch class info to get sessions and class name
        const classResponse = await fetch(
          `${SERVER_BASE_URL}api/classInfoTeacher`,
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ _id: classId }),
          }
        );

        console.log("Class ID:", classId);
        const classData = await classResponse.json();
        console.log("Class Data:", classData);

        if (classData.error) {
          throw new Error(classData.error);
        }

        setClassName(classData.classInfo.className || "");
        const sessionIds = classData.classInfo.sessions.map(
          (session: any) => session._id
        );

        // Fetch attendance information for each session
        const attendanceHistory = await Promise.all(
          sessionIds.map(async (sessionId: string) => {
            console.log("Fetching session info for Session ID:", sessionId);
            const sessionResponse = await fetch(
              `${SERVER_BASE_URL}api/getSessionInfo`,
              {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ sessionId }),
              }
            );
            const sessionData = await sessionResponse.json();
            console.log("Session Data:", sessionData);

            if (sessionData.error) {
              throw new Error(sessionData.error);
            }

            // Check if studentId exists in the session's students array and evaluate attendanceGrade
            const sessionStudent = sessionData.students.find(
              (s: any) => s.userId === studentId // Compare with userId instead of _id
            );
            console.log(
              `Student attendance in Session ${sessionId}:`,
              sessionStudent
            );

            const attendance = sessionStudent
              ? sessionStudent.attendanceGrade
                ? "Present"
                : "Absent"
              : "Absent";
            console.log(
              `Attendance for student ${studentId} in session ${sessionId}:`,
              attendance
            );

            return {
              _id: sessionId,
              startTime: sessionData.startTime,
              endTime: sessionData.endTime,
              attendance,
            };
          })
        );

        console.log("Final Attendance History:", attendanceHistory);
        setSessions(attendanceHistory);
      } catch (err: any) {
        console.error("Error fetching attendance history:", err);
        setError(err.message || "Failed to fetch attendance history.");
      } finally {
        setLoading(false);
      }
    };

    if (classId && studentId) {
      fetchClassAndSessionInfo();
    } else {
      setError("Class ID or Student ID is missing.");
      setLoading(false);
    }
  }, [classId, studentId]);

  return (
    <div className="student-history-page">
      <Header />
      <SideBar />
      <div className="history-content">
        <div className="breadcrumb" onClick={() => navigate("/student")}>
          &lt; Back to Classes
        </div>

        <div className="history-table-container">
          <h2 className="history-title">
            {className ? `${className} - History` : "Class History"}
          </h2>
          <div className="history-table">
            {loading ? (
              <p>Loading history...</p>
            ) : error ? (
              <p className="error-message">{error}</p>
            ) : sessions.length > 0 ? (
              sessions.map((session) => {
                const startDate = new Date(Date.parse(session.startTime));
                const endDate = new Date(Date.parse(session.endTime));

                const isValidStartDate = !isNaN(startDate.getTime());
                const isValidEndDate = !isNaN(endDate.getTime());

                // Set a default value for attendance if it's undefined
                const attendance = session.attendance || "Absent";

                return (
                  <div key={session._id} className="history-row">
                    <span>
                      {isValidStartDate && isValidEndDate
                        ? `${startDate.toLocaleDateString()} ${startDate.toLocaleTimeString()} to ${endDate.toLocaleTimeString()}`
                        : "Invalid Date"}
                    </span>
                    <span
                      className={`attendance-status ${attendance.toLowerCase()}`}
                    >
                      {attendance}
                    </span>
                  </div>
                );
              })
            ) : (
              <div className="no-history-message">No history available</div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default StudentHistoryPage;
