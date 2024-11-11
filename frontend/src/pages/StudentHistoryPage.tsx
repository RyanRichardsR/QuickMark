import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom"; // Add useParams to get classId from URL
import Header from "../components/Header";
import SideBar from "../components/SideBar";
import "../styles/StudentHistoryPage.css";
import { SERVER_BASE_URL } from "../config"; // Adjust the import path as needed

const StudentHistoryPage: React.FC = () => {
  const navigate = useNavigate();
  const { classId } = useParams<{ classId: string }>(); // Get classId from URL params
  const [sessions, setSessions] = useState<any[]>([]); // State to hold session data
  const [loading, setLoading] = useState<boolean>(true); // State to show loading status
  const [error, setError] = useState<string>(""); // State to show error messages
  const [className, setClassName] = useState<string>(""); // State to hold class name

  useEffect(() => {
    // Fetch class info (including sessions with attendance) from the backend
    const fetchClassInfo = async () => {
      try {
        const response = await fetch(`${SERVER_BASE_URL}api/classInfoTeacher`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ _id: classId }), // Pass classId in the body
        });

        const data = await response.json();

        if (data.error) {
          setError(data.error);
        } else {
          setSessions(data.classInfo.sessions || []); // Set sessions from classInfo
          setClassName(data.classInfo.className || ""); // Set class name from classInfo
        }
      } catch (err) {
        setError("Failed to fetch class information. Please try again later.");
      } finally {
        setLoading(false); // Set loading to false after fetching
      }
    };

    if (classId) {
      fetchClassInfo();
    }
  }, [classId]);

  return (
    <div className="student-history-page">
      <Header />
      <SideBar />
      <div className="history-content">
        {/* Breadcrumb */}
        <div className="breadcrumb" onClick={() => navigate("/student")}>
          &lt; Back to Classes
        </div>

        {/* Class Title */}
        <div className="history-table-container">
          <h2 className="history-title">{className ? `${className} - History` : "Class History"}</h2>
          <div className="history-table">
            {loading ? (
              <p>Loading history...</p>
            ) : error ? (
              <p className="error-message">{error}</p>
            ) : sessions.length > 0 ? (
              sessions.map((session, index) => {
                const startDate = new Date(Date.parse(session.startTime));
                const endDate = new Date(Date.parse(session.endTime));

                // Check if startDate and endDate are valid
                const isValidStartDate = !isNaN(startDate.getTime());
                const isValidEndDate = !isNaN(endDate.getTime());

                // Determine attendance status (for example, "Present" or "Absent")
                const attendance = session.attendanceStatus || "Unknown"; // Adjust based on API response

                return (
                  <div key={session._id || index} className="history-row">
                    <span>
                      {isValidStartDate && isValidEndDate
                        ? `${startDate.toLocaleDateString()} ${startDate.toLocaleTimeString()} to ${endDate.toLocaleTimeString()}`
                        : "Invalid Date"}
                    </span>
                    <span 
                      className={`attendance-status ${attendance.toLowerCase()}`}>
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
