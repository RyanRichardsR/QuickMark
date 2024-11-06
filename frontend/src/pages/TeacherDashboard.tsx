import React from "react";
import Header from "../components/Header";
import SideBar from "../components/SideBar";
import Cards from "../components/Cards";

const TeacherDashboard = () => {
  return (
    <div>
      {/* Header at the top */}
      <Header />

      {/* Sidebar as a fixed overlay on the left */}
      <SideBar />

      {/* Scrollable container for cards */}
      <div className="cards-scroll-container">
        <Cards userRole="teacher" showJoinCode />
        {/* Show join code on teacher dashboard */}
      </div>
    </div>
  );
};

export default TeacherDashboard;
