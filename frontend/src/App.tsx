import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import "./styles/App.css";
import LoginPage from "./pages/AuthPage";
import TeacherDashboard from "./pages/TeacherDashboard";
import StudentDashboard from "./pages/StudentDashboard";
import SessionsPage from "./pages/SessionsPage";
import StudentHistoryPage from "./pages/StudentHistoryPage";


function App() {
  const userRole = localStorage.getItem("role");

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

        {/* Catch-all route to redirect unknown paths */}
        <Route path="*" element={<Navigate to="/" replace />} />

      </Routes>
    </BrowserRouter>
  );
}

export default App;
