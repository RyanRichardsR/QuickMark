import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import "./styles/App.css";
import LoginPage from "./pages/AuthPage";
import TeacherDashboard from "./pages/TeacherDashboard";
import StudentDashboard from "./pages/StudentDashboard";
import SessionsPage from "./pages/SessionsPage";
import StudentHistoryPage from "./pages/StudentHistoryPage";
import SessionDetailsPage from "./pages/SessionDetailsPage";
import ResetPassword from "./pages/ResetPassword";

function App() {
  const userData = localStorage.getItem("user_data");  // Get complete user data (not just the role)

  // If no user data, send them to the login page
  if (!userData) {
    return (
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<LoginPage />} />
          <Route path="/resetpassword/:token" element={<ResetPassword />} />
        </Routes>
      </BrowserRouter>
    );
  }

  const userRole = JSON.parse(userData).role; // Extract the role from the user data

  return (
    <BrowserRouter>
      <Routes>
        <Route
          path="/"
          element={
            userRole === "teacher" ? (
              <Navigate to="/teacher" />
            ) : userRole === "student" ? (
              <Navigate to="/student" />
            ) : (
              <LoginPage />
            )
          }
        />
        {/* Teacher Dashboard */}
        <Route path="/teacher" element={<TeacherDashboard />} />

        {/* Student Dashboard */}
        <Route path="/student" element={<StudentDashboard />} />

        {/* Sessions Page for both roles */}
        <Route path="/sessions/:classId" element={<SessionsPage />} />

        <Route path="/history/:classId" element={<StudentHistoryPage />} /> 

        <Route path="/session-details/:sessionId" element={<SessionDetailsPage />} />

        <Route path="/resetpassword/:token" element={<ResetPassword />} />

        {/* Catch-all route to redirect unknown paths */}
        <Route path="*" element={<Navigate to="/" replace />} />

      </Routes>
    </BrowserRouter>
  );
}

export default App;
