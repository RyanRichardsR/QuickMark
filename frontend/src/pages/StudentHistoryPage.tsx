// StudentHistoryPage.tsx
import React from "react";
import { useNavigate } from "react-router-dom";
import Header from "../components/Header";
import SideBar from "../components/SideBar";
import "../styles/StudentHistoryPage.css";

const StudentHistoryPage: React.FC = () => {
  const navigate = useNavigate();

  // Hardcoded session data with attendance status
  const sessions = [
    { date: "2024-10-30", time: "09:00 - 10:00", attendance: "Present" },
    { date: "2024-10-30", time: "10:30 - 11:30", attendance: "Absent" },
    { date: "2024-10-30", time: "12:00 - 13:00", attendance: "Present" },
    { date: "2024-10-30", time: "14:00 - 15:00", attendance: "Absent" },
    { date: "2024-10-30", time: "16:00 - 17:00", attendance: "Present" },
  ];

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
          <h2 className="history-title">COP 4331 - History</h2>
          <div className="history-table">
            {sessions.length > 0 ? (
              sessions.map((session, index) => (
                <div key={index} className="history-row">
                  <span>{session.date} {session.time}</span>
                  <span 
                    className={`attendance-status ${session.attendance.toLowerCase()}`}>
                    {session.attendance}
                  </span>
                </div>
              ))
            ) : (
              <div className="no-history-message">
                No history available
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default StudentHistoryPage;
