import React from "react";
import "../styles/AboutUs.css"; // Link to the CSS file for styling

const teamMembers = [
  { name: "Ryan", title: "Mobile Dev"},
  { name: "Dina", title: "Frontend Web Dev"},
  { name: "Niklas", title: "Bluetooth/Mobile Dev"},
  { name: "Thaw", title: "Bluetooth/Mobile Dev"},
  { name: "Sam", title: "API/Database"},
  { name: "Anthony", title: "API/Database"},
];

const AboutUs = () => {
  return (
    <div className="about-us">
      <h1>About Us</h1>
      <div className="team-container">
        {teamMembers.map((member, index) => (
          <div className="team-member" key={index}>
            <div className="profile-pic">
                {/* place holder image*/}
              <img src="/path-to-placeholder-image.png" alt="Profile" /> {/* Use a default profile image path */}
            </div>
            <h3>{member.name}</h3>
            <p>{member.title}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AboutUs;
