// SessionsTable.tsx
import React from "react";
import "../styles/SessionsTable.css";

const SessionsTable: React.FC<{ sessions: { date: string; time: string }[] }> = ({ sessions }) => {
  return (
    <div className="sessions-table-container">
      <h2 className="sessions-heading">Sessions</h2>
      <div className="sessions-table">
        {sessions.length > 0 ? (
          sessions.map((session, index) => (
            <div key={index} className="session-row">
              <span>{session.date} - {session.time}</span>
              <span className="arrow">&gt;</span>
            </div>
          ))
        ) : (
          <p className="no-sessions-message">No sessions available</p>
        )}
      </div>
    </div>
  );
};

export default SessionsTable;
