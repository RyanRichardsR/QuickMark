import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Header from "../components/Header";
import SideBar from "../components/SideBar";
import "../styles/SessionsPage.css";

const SessionsPage: React.FC = () => {
  const navigate = useNavigate();
  const { classId } = useParams<{ classId: string }>();
  const [sessions, setSessions] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>("");
  const [className, setClassName] = useState<string>("");
  const [message, setMessage] = useState<string>("");

  useEffect(() => {
    const fetchClassInfo = async () => {
      try {
        const response = await fetch(`http://cop4331.xyz/api/classInfoTeacher`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ _id: classId }),
        });
        const data = await response.json();

        if (data.error) {
          setError(data.error);
        } else {
          setSessions(data.classInfo.sessions || []);
          setClassName(data.classInfo.className || "");
        }
      } catch (err) {
        setError("Failed to fetch class information. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    if (classId) {
      fetchClassInfo();
    }
  }, [classId]);

  const handleSessionClick = (sessionId: string) => {
    navigate(`/session-details/${classId}/${sessionId}`);
  };

  const handleDeleteClass = async () => {
    const confirmed = window.confirm("Are you sure you want to delete this class? All your history will be lost and you cannot undo this action.");
    if (!confirmed) return;

    try {
      const response = await fetch(`http://cop4331.xyz/api/deleteClass`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ classObjectId: classId }),
      });

      const data = await response.json();

      if (data.success) {
        setMessage("Class deleted successfully.");
        navigate("/teacher"); // Redirect to the teacher's classes page
      } else {
        setMessage(data.error || "Failed to delete the class. Please try again.");
      }
    } catch (error) {
      setMessage("An error occurred. Please try again later.");
    }
  };

  return (
    <div className="sessions-page">
      <Header />
      <SideBar />
      <div className="sessions-content">
        <div className="breadcrumb" onClick={() => navigate("/teacher")}>
          &lt; Back to Classes
        </div>

        {message && <p className="delete-message">{message}</p>}

        <div className="delete-class-container">
          <button className="delete-class-button" onClick={handleDeleteClass}>
            Delete Class
          </button>
        </div>

        <div className="sessions-table-container">
          <h2 className="sessions-title">{className ? `${className} - Sessions` : "Class Sessions"}</h2>
          <div className="sessions-table">
            {loading ? (
              <p>Loading sessions...</p>
            ) : error ? (
              <p className="error-message">{error}</p>
            ) : sessions.length > 0 ? (
              sessions.map((session, index) => {
                const startDate = new Date(Date.parse(session.startTime));
                const endDate = new Date(Date.parse(session.endTime));
                const isValidStartDate = !isNaN(startDate.getTime());
                const isValidEndDate = !isNaN(endDate.getTime());

                return (
                  <div key={session._id || index} className="session-row" onClick={() => handleSessionClick(session._id)}>
                    <span>
                      {isValidStartDate && isValidEndDate
                        ? `${startDate.toLocaleDateString()} - ${startDate.toLocaleTimeString()} to ${endDate.toLocaleTimeString()}`
                        : "Invalid Date"}
                    </span>
                    <span className="arrow">&gt;</span>
                  </div>
                );
              })
            ) : (
              <div className="no-sessions-message">No sessions available</div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SessionsPage;
