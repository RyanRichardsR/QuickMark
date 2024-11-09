import React from "react";
import { useNavigate } from "react-router-dom";
import Header from "../components/Header";
import SideBar from "../components/SideBar";
import "../styles/SessionsPage.css";

const SessionsPage: React.FC = () => {
  const navigate = useNavigate();

  // Hardcoded session data
  const sessions = [
    { date: "2024-10-30", time: "09:00 - 10:00", id: "session-001" },
    { date: "2024-10-30", time: "10:30 - 11:30", id: "session-002" },
    { date: "2024-10-30", time: "12:00 - 13:00", id: "session-003" },
    { date: "2024-10-30", time: "14:00 - 15:00", id: "session-004" },
    { date: "2024-10-30", time: "16:00 - 17:00", id: "session-005" },
    { date: "2024-10-30", time: "09:00 - 10:00", id: "session-001" },
    { date: "2024-10-30", time: "10:30 - 11:30", id: "session-002" },
    { date: "2024-10-30", time: "12:00 - 13:00", id: "session-003" },
    { date: "2024-10-30", time: "14:00 - 15:00", id: "session-004" },
    { date: "2024-10-30", time: "16:00 - 17:00", id: "session-005" },
    { date: "2024-10-30", time: "09:00 - 10:00", id: "session-001" },
    { date: "2024-10-30", time: "10:30 - 11:30", id: "session-002" },
    { date: "2024-10-30", time: "12:00 - 13:00", id: "session-003" },
    { date: "2024-10-30", time: "14:00 - 15:00", id: "session-004" },
    { date: "2024-10-30", time: "16:00 - 17:00", id: "session-005" },
  ];

  return (
    <div className="sessions-page">
      <Header />
      <SideBar />
      <div className="sessions-content">
        {/* Breadcrumb */}
        <div className="breadcrumb" onClick={() => navigate("/teacher")}>
          &lt; Back to Classes
        </div>

        {/* Class Title */}
        <div className="sessions-table-container">
          <h2 className="sessions-title">COP 4331 - Sessions</h2>
          <div className="sessions-table">
            {sessions.length > 0 ? (
              sessions.map((session, index) => (
                <div key={index} className="session-row">
                  <span>{session.date}  {session.time}</span>
                  <span className="arrow">&gt;</span>
                </div>
              ))
            ) : (
              <div className="no-sessions-message">
                No sessions available
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SessionsPage;
