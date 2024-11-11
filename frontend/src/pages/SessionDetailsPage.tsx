import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Header from "../components/Header";
import SideBar from "../components/SideBar";
import "../styles/SessionDetailsPage.css";

const SessionDetailsPage: React.FC = () => {
  const navigate = useNavigate();
  const { sessionId } = useParams<{ sessionId: string }>();
  const [students] = useState<any[]>([
    { name: "John Doe", attendanceStatus: "Present" },
    { name: "Jane Smith", attendanceStatus: "Absent" },
    { name: "Alice Johnson", attendanceStatus: "Present" },
    { name: "Bob Brown", attendanceStatus: "Absent" },
    { name: "Charlie Green", attendanceStatus: "Present" },
    { name: "John Doe", attendanceStatus: "Present" },
    { name: "Jane Smith", attendanceStatus: "Absent" },
    { name: "Alice Johnson", attendanceStatus: "Present" },
    { name: "Bob Brown", attendanceStatus: "Absent" },
    { name: "Charlie Green", attendanceStatus: "Present" },
    { name: "John Doe", attendanceStatus: "Present" },
    { name: "Jane Smith", attendanceStatus: "Absent" },
    { name: "Alice Johnson", attendanceStatus: "Present" },
    { name: "Bob Brown", attendanceStatus: "Absent" },
    { name: "Charlie Green", attendanceStatus: "Present" },
    

  ]);
  const [loading] = useState<boolean>(false);
  const [error, setError] = useState<string>("");

  useEffect(() => {
    if (!sessionId) {
      setError("Session ID is missing.");
    }
  }, [sessionId]);

  return (
    <div className="session-details-page">
      <Header />
      <SideBar />
      <div className="session-content">
        {/* Breadcrumb */}
        <div className="breadcrumb" onClick={() => navigate(-1)}>
          &lt; Back to Sessions
        </div>

        <h2 className="session-title">Session Details</h2>
        <p className="session-subtitle">Attendance Record</p>
        <div className="students-table">
          {loading ? (
            <p>Loading student attendance...</p>
          ) : error ? (
            <p className="error-message">{error}</p>
          ) : students.length > 0 ? (
            students.map((student, index) => (
              <div key={index} className="student-row">
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
