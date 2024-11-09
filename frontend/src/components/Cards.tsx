import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import AddClassModal from "../components/AddClassModal";
import JoinClassModal from "../components/JoinClassModal";
import "../styles/Cards.css";

interface CardsProps {
  showJoinCode?: boolean;
  userRole: "teacher" | "student";
}

const Cards: React.FC<CardsProps> = ({ showJoinCode, userRole }) => {
  const navigate = useNavigate();
  const [isAddClassModalOpen, setIsAddClassModalOpen] = useState(false);
  const [isJoinClassModalOpen, setIsJoinClassModalOpen] = useState(false);
  const [classes, setClasses] = useState<any[]>([]); // State for dynamically loaded classes
  const colors = ["#4A5D23", "#2F4F4F", "#4A5D23", "#4B3C5D"];

  useEffect(() => {
    const fetchClasses = async () => {
      // Retrieve user data from localStorage
      const userData = localStorage.getItem("user_data");
      console.log("Raw user data from localStorage:", userData);

      if (!userData) {
        console.error("No user data found in localStorage.");
        return;
      }

      const { login: login } = JSON.parse(userData);
      console.log("Parsed login ID:", login);

      try {
        console.log("Sending request to /api/classes with login:", login);
        const response = await fetch("http://localhost:3000/api/classes", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ login }), // Send the login ID in the request body
        });

        // Log the full response for inspection
        console.log("Raw response object:", response);

        if (!response.ok) {
          console.error("Failed to fetch classes:", response.statusText);
          return;
        }

        const data = await response.json();
        console.log("Parsed response JSON:", data);

        if (data.error) {
          console.error("Error from API:", data.error);
        } else {
          console.log("Classes retrieved successfully:", data.classes);
          setClasses(data.classes); // Set classes from the response
        }
      } catch (error) {
        console.error("Error during API call:", error);
      }
    };

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

  // Navigate to the appropriate page based on the user role and class ID
  const handleCardClick = (classId: string) => {
    if (userRole === "teacher") {
      navigate(`/sessions/${classId}`);
    } else {
      // Navigate to the student's history page for that class
      navigate(`/history/${classId}`);
    }
  };

  return (
    <div className="cards-container">
      {classes.map((classItem, index) => (
        <div
          key={classItem._id}
          className="card"
          onClick={() => handleCardClick(classItem._id)}
        >
          <div
            className="card-header"
            style={{ backgroundColor: colors[index % colors.length] }}
          ></div>
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
      <div className="card add-card" onClick={handleAddClassClick}>
        <div className="card-content">
          <span className="add-icon">+</span>
          <p className="add-text">Add Class</p>
        </div>
      </div>

      {/* Modal for Adding or Joining Class */}
      {userRole === "teacher" && (
        <AddClassModal
          isOpen={isAddClassModalOpen}
          onClose={closeAddClassModal}
        />
      )}
      {userRole === "student" && (
        <JoinClassModal
          isOpen={isJoinClassModalOpen}
          onClose={closeJoinClassModal}
        />
      )}
    </div>
  );
};

export default Cards;
