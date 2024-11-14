import Header from "../components/Header";
import SideBar from "../components/SideBar";
import Cards from "../components/Cards";
import "../styles/Dashboard.css";

const StudentDashboard = () => {
  return (
    <div className="dashboard-container">
      <Header />
      <SideBar />
      <main className="dashboard-main">
        <Cards userRole="student" showJoinCode />
      </main>
    </div>
  );
};

export default StudentDashboard;