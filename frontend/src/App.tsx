import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import "./styles/App.css";
import LoginPage from "./pages/AuthPage";
import TeacherDashboard from "./pages/TeacherDashboard";
import StudentDashboard from "./pages/StudentDashboard";

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
        <Route path="/teacher" element={<TeacherDashboard />} />
        <Route path="/student" element={<StudentDashboard />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
