import React, { useState } from "react";
import "../styles/JoinClassModal.css";
import { SERVER_BASE_URL } from "../config";

interface JoinClassModalProps {
  isOpen: boolean;
  onClose: () => void;
  onClassJoined: () => void; // New prop to trigger refresh in parent
}

const JoinClassModal: React.FC<JoinClassModalProps> = ({
  isOpen,
  onClose,
  onClassJoined,
}) => {
  const [classCode, setClassCode] = useState("");
  const [message, setMessage] = useState("");

  const handleClose = () => {
    setClassCode("");
    setMessage("");
    onClose();
  };

  const handleJoin = async () => {
    const userData = JSON.parse(localStorage.getItem("user_data") || "{}");
    const studentId = userData.id;

    if (!classCode || !studentId) {
      setMessage("Please enter the class code.");
      return;
    }

    try {
      const response = await fetch(`${SERVER_BASE_URL}api/joinClass`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ studentObjectId: studentId, joinCode: classCode }),
      });

      const data = await response.json();

      if (data.error) {
        setMessage(data.error);
      } else if (data.success) {
        setMessage("Successfully joined the class!");
        onClassJoined(); // Refresh the classes in the parent component
        handleClose(); // Close modal after successful join
      }
    } catch (error) {
      console.error("Error joining class:", error);
      setMessage("An error occurred. Please try again.");
    }
  };

  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={handleClose}>
      <div className="modal-container" onClick={(e) => e.stopPropagation()}>
        <button className="modal-close" onClick={handleClose}>
          &times;
        </button>

        <h2 className="modal-title">Join a Class</h2>
        <div className="modal-content">
          <label className="modal-label">Class Code:</label>
          <input
            type="text"
            placeholder="Enter class code"
            value={classCode}
            onChange={(e) => setClassCode(e.target.value)}
            className="modal-input"
          />
          <div className="modal-buttons">
            <button onClick={handleJoin} className="modal-button">
              Join Class
            </button>
          </div>
          {message && <p className="modal-message">{message}</p>}
        </div>
      </div>
    </div>
  );
};

export default JoinClassModal;
