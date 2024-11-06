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
  const [step, setStep] = useState(1); // Track the current step

  // Proceed to the next step
  const handleNext = () => {
    if (step === 1 && className && classID) {
      setStep(2); // Move to step 2 if step 1 fields are filled
    } else if (step === 2 && joinCode) {
      setStep(3); // Move to step 3 if step 2 field is filled
    } else {
      alert("Please fill in all fields"); // Notify user if fields are empty
    }
  };

  // Handle modal close and reset state
  const handleClose = () => {
    setStep(1); // Reset to step 1
    setClassName("");
    setClassID("");
    setJoinCode("");
    onClose(); // Close the modal
  };

  // Handle submit action in the final step
  const handleSubmit = () => {
    alert("Class Added!");
    handleClose(); // Close the modal after submission
  };

  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={handleClose}>
      <div className="modal-container" onClick={(e) => e.stopPropagation()}>
        {/* Close Button */}
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
      </div>
    </div>
  );
};

export default AddClassModal;
