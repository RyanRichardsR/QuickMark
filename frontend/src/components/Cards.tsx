// Cards.jsx
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import AddClassModal from "../components/AddClassModal";
import JoinClassModal from "../components/JoinClassModal";
import {  } from "../config";
import "../styles/Cards.css";

interface CardsProps {
  showJoinCode?: boolean;
  userRole: "teacher" | "student";
}

interface ClassItem {
  _id: string;
  className: string;
  classID: string;
  joinCode: string;
}

const Cards: React.FC<CardsProps> = ({ showJoinCode, userRole }) => {
  const navigate = useNavigate();
  const [isAddClassModalOpen, setIsAddClassModalOpen] = useState(false);
  const [isJoinClassModalOpen, setIsJoinClassModalOpen] = useState(false);
  const [classes, setClasses] = useState<ClassItem[]>([]);

  const fetchClasses = async () => {
    const userData = localStorage.getItem("user_data");

    if (!userData) {
      console.error("No user data found in localStorage.");
      return;
    }

    const { login } = JSON.parse(userData);

    try {
      const response = await fetch(`http://cop4331.xyz/api/classes`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ login }),
      });

      if (!response.ok) {
        console.error("Failed to fetch classes:", response.statusText);
        return;
      }

      const data = await response.json();

      if (data.error) {
        console.error("Error from API:", data.error);
      } else {
        setClasses(data.classes);
      }
    } catch (error) {
      console.error("Error during API call:", error);
    }
  };

  useEffect(() => {
    fetchClasses();
  }, []);

  const handleAddClassClick = () => {
    if (userRole === "teacher") {
      setIsAddClassModalOpen(true);
    } else {
      setIsJoinClassModalOpen(true);
    }
  };

  const closeAddClassModal = () => setIsAddClassModalOpen(false);
  const closeJoinClassModal = () => setIsJoinClassModalOpen(false);

  const handleCardClick = (classId: string) => {
    if (userRole === "teacher") {
      navigate(`/sessions/${classId}`);
    } else {
      navigate(`/history/${classId}`);
    }
  };

  return (
    <div className="cards-container">
      {classes.map((classItem) => (
        <div
          key={classItem._id}
          className="card"
          onClick={() => handleCardClick(classItem._id)}
        >
          <div className="card-header"></div>
          <div className="card-content">
            <h3 className="card-title">{classItem.className}</h3>
            <p className="card-description">{classItem.classID}</p>
            {showJoinCode && userRole === "teacher" && (
              <p className="card-join-code">Join Code: {classItem.joinCode}</p>
            )}
          </div>
        </div>
      ))}

      {/* Add Class Card */}
      <div className="add-card" onClick={handleAddClassClick}>
        <span className="add-icon">+</span>
        <p className="add-text">Add Class</p>
      </div>

      {/* Modals */}
      {userRole === "teacher" && (
        <AddClassModal
          isOpen={isAddClassModalOpen}
          onClose={closeAddClassModal}
          onClassAdded={fetchClasses} // Pass fetchClasses as onClassAdded prop
        />
      )}
      {userRole === "student" && (
        <JoinClassModal
          isOpen={isJoinClassModalOpen}
          onClose={closeJoinClassModal}
          onClassJoined={fetchClasses}
        />
      )}
    </div>
  );
};

export default Cards;
