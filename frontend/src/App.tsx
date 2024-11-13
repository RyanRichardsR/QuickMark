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
  const userData = localStorage.getItem("user_data");

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

  const userRole = JSON.parse(userData).role;

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

        {/* Sessions Page for both roles, with classId */}
        <Route path="/sessions/:classId" element={<SessionsPage />} />

        {/* Student History Page with classId */}
        <Route path="/history/:classId" element={<StudentHistoryPage />} /> 

        {/* Session Details Page with both classId and sessionId */}
        <Route path="/session-details/:classId/:sessionId" element={<SessionDetailsPage />} />

        <Route path="/resetpassword/:token" element={<ResetPassword />} />

        {/* Catch-all route to redirect unknown paths */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
