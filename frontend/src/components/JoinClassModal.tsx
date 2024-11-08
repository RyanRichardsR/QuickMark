import React, { useState } from "react";
import "../styles/JoinClassModal.css";

interface JoinClassModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const JoinClassModal: React.FC<JoinClassModalProps> = ({ isOpen, onClose }) => {
  const [classCode, setClassCode] = useState("");

  // Handle modal close and reset state
  const handleClose = () => {
    setClassCode(""); // Reset input field
    onClose(); // Close the modal
  };

  // Handle join action
  const handleJoin = () => {
    alert(`Attempting to join class with code: ${classCode}`);
    handleClose(); // Close the modal after the action
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
        </div>
      </div>
    </div>
  );
};

export default JoinClassModal;
