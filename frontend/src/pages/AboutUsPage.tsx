
import Header from "../components/Header";
import SideBar from "../components/SideBar";
import "../styles/AboutUs.css"; // Link to the CSS file for styling

const teamMembers = [
  { name: "Ryan", title: "Mobile Dev", linkedin: "https://www.linkedin.com/in/ryan-richards-r/" },
  { name: "Dina", title: "Frontend Web Dev", linkedin: "http://linkedin.com/in/dina-kazzoun-b44a9419a" },
  { name: "Niklas", title: "Bluetooth/Mobile Dev", linkedin: "http://linkedin.com/in/niklas-edstrom-306330209" },
  { name: "Thaw", title: "Bluetooth/Mobile Dev", linkedin: "https://www.linkedin.com/in/thaw" },
  { name: "Sam", title: "API/Database", linkedin: "https://www.linkedin.com/in/samwattsdev/" },
  { name: "Anthony", title: "API/Database", linkedin: "https://www.linkedin.com/in/anthony-bonus-4a083726b/" },
];

const AboutUs = () => {
  return (
    <>
      <Header />
      <SideBar />
      <div className="about-us">
        <div className="team-container">
          {teamMembers.map((member, index) => (
            <div className="team-member" key={index}>
              <div className="profile-pic">
                {/* image */}
                <img src="/blankProfile.png" alt="Profile" />
              </div>
              <h3>
                {/* LinkedIn */}
                <a href={member.linkedin} target="_blank" rel="noopener noreferrer">
                  {member.name}
                </a>
              </h3>
              <p>{member.title}</p>
            </div>
          ))}
        </div>
      </div>
    </>
  );
};

export default AboutUs;
