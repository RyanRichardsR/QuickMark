import Header from "../components/Header";
import SideBar from "../components/SideBar";
import Cards from "../components/Cards";

const StudentDasboard = () => {
  return (
    <div>
      {/* Header at the top */}
      <Header />

      {/* Sidebar as a fixed overlay on the left */}
      <SideBar />

      {/* Scrollable container for cards */}
      <div className="cards-scroll-container">
      <Cards userRole="student" showJoinCode />
      </div>
    </div>
  );
};
export default StudentDasboard;
