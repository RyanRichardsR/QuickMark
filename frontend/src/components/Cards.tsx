import React from "react";
import { useNavigate } from "react-router-dom";
import "../styles/Cards.css";

interface CardsProps {
    showJoinCode?: boolean; // Optional prop to control the visibility of the join code
  }
  
  const Cards: React.FC<CardsProps> = ({ showJoinCode }) => {
    const navigate = useNavigate();

   // Hardcoded class data with added classID property
   const classes = [
    {
      _id: "60c72b2f5f1b2c001c8d4f1e",
      joinCode: "ABC123",
      teacherID: "60c72b2f5f1b2c001c8d4f1f",
      students: ["60c72b2f5f1b2c001c8d4f20", "60c72b2f5f1b2c001c8d4f21"],
      interval: 30,
      sessions: ["session1", "session2"],
      className: "COP4331C",
      classID: "24Fall 0001"
    },
    {
      _id: "60c72b2f5f1b2c001c8d4f1d",
      joinCode: "XYZ789",
      teacherID: "60c72b2f5f1b2c001c8d4f2f",
      students: ["60c72b2f5f1b2c001c8d4f22", "60c72b2f5f1b2c001c8d4f23"],
      interval: 20,
      sessions: ["session3", "session4"],
      className: "COP4710C",
      classID: "24Fall 0002"
    },
    {
      _id: "60c72b2f5f1b2c001c8d4f1c",
      joinCode: "LMN456",
      teacherID: "60c72b2f5f1b2c001c8d4f1b",
      students: ["60c72b2f5f1b2c001c8d4f24", "60c72b2f5f1b2c001c8d4f25"],
      interval: 25,
      sessions: ["session5", "session6"],
      className: "COP3223C",
      classID: "24Fall 0003"
    },
    {
      _id: "60c72b2f5f1b2c001c8d4f1b",
      joinCode: "QRS123",
      teacherID: "60c72b2f5f1b2c001c8d4f2b",
      students: ["60c72b2f5f1b2c001c8d4f26", "60c72b2f5f1b2c001c8d4f27"],
      interval: 15,
      sessions: ["session7", "session8"],
      className: "CIS3361C",
      classID: "24Fall 0004"
    }
    // Add more class objects as needed
  ];

  // Function to navigate to the class details page
  const handleCardClick = (id: string) => {
    navigate(`/class-details/${id}`);
  };

  // Function to handle adding a new class
  const handleAddClassClick = () => {
    navigate("/add-class"); // Navigate to an add class page or open a modal
  };

   // Array of colors for alternating card headers
   const colors = ["#4A5D23", "#2F4F4F", "#4A5D23", "#4B3C5D"];

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
          </div>
        </div>
      ))}

      {/* Add Class Card */}
      <div className="card add-card" onClick={() => navigate("/add-class")}>
        <div className="card-content">
          <span className="add-icon">+</span>
          <p className="add-text">Add Class</p>
        </div>
      </div>
    </div>
  );
};

export default Cards;
