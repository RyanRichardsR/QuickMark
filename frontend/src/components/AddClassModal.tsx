import React, { useState } from "react";
import "../styles/AddClassModal.css";

interface AddClassModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const AddClassModal: React.FC<AddClassModalProps> = ({ isOpen, onClose }) => {
  const [className, setClassName] = useState("");
  const [classID, setClassID] = useState("");
  const [joinCode, setJoinCode] = useState("");
  const [step, setStep] = useState(1);
  const [message, setMessage] = useState(""); // For error/success messages

  const handleNext = () => {
    if (step === 1 && className && classID) {
      setStep(2);
    } else if (step === 2 && joinCode) {
      setStep(3);
    } else {
      alert("Please fill in all fields");
    }
  };

  const handleClose = () => {
    setStep(1);
    setClassName("");
    setClassID("");
    setJoinCode("");
    setMessage("");
    onClose();
  };

  const handleSubmit = async () => {
    const userData = JSON.parse(localStorage.getItem("user_data") || "{}");
    const teacherID = userData.id; // Use `id` instead of `login`
    console.log("Teacher ID:", teacherID);
  
    // Ensure all necessary data is available
    if (!className || !joinCode || !teacherID) {
      setMessage("Please complete all fields.");
      return;
    }
  
    try {
      const response = await fetch("http://localhost:3000/api/createClass", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ className, joinCode, teacherID }), // Pass `teacherID` as `id`
      });
  
      const data = await response.json();
  
      if (data.error) {
        setMessage(data.error);
      } else {
        setMessage("Class successfully added!");
  
        handleClose(); // Close modal after successful submission
      }
    } catch (error) {
      console.error("Error adding class:", error);
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

        <h2 className="modal-title">Add a Class</h2>
        <div className="modal-content">
          {step === 1 && (
            <>
              <label className="modal-label">Class Name:</label>
              <input
                type="text"
                placeholder="e.g. COP 4331"
                value={className}
                onChange={(e) => setClassName(e.target.value)}
                className="modal-input"
              />
              <label className="modal-label">Class ID:</label>
              <input
                type="text"
                placeholder="e.g. Fall24 0002"
                value={classID}
                onChange={(e) => setClassID(e.target.value)}
                className="modal-input"
              />
              <div className="modal-buttons">
                <button onClick={handleNext} className="modal-button">
                  Next
                </button>
              </div>
            </>
          )}

          {step === 2 && (
            <>
              <label className="modal-label">Join Code:</label>
              <input
                type="text"
                placeholder="e.g. HelloClass2024"
                value={joinCode}
                onChange={(e) => setJoinCode(e.target.value)}
                className="modal-input"
              />
              <div className="modal-buttons">
                <button onClick={() => setStep(1)} className="modal-back-button">
                  Back
                </button>
                <button onClick={handleNext} className="modal-button">
                  Next
                </button>
              </div>
            </>
          )}

          {step === 3 && (
            <>
              <p><strong>Class Name:</strong> {className}</p>
              <p><strong>Class ID:</strong> {classID}</p>
              <p><strong>Join Code:</strong> {joinCode}</p>
              <div className="modal-buttons">
                <button onClick={() => setStep(2)} className="modal-back-button">
                  Back
                </button>
                <button onClick={handleSubmit} className="modal-submit-button">
                  Submit
                </button>
              </div>
            </>
          )}
        </div>
        {message && <p className="modal-message">{message}</p>}
      </div>
    </div>
  );
};

export default AddClassModal;
