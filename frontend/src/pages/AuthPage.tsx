// AuthPage.tsx
import { useState } from "react";
import LoginForm from "../components/LoginForm";
import RegistrationForm from "../components/RegistrationForm";
import ForgotPasswordForm from "../components/ForgotPasswordForm";
import "../AuthPage.css";

const AuthPage: React.FC = () => {
  const [view, setView] = useState<"login" | "register" | "forgotPassword">("login");

  return (
    <div className="auth-page">
      <div className="auth-container">
        <div className="auth-left">
          <h1>Welcome to QuickMark</h1>
          <p>Your smart attendance tracker</p>
        </div>
        
        <div className="auth-right">
          {view === "login" && (
            <LoginForm
              onForgotPassword={() => setView("forgotPassword")}
              onSwitch={() => setView("register")}
            />
          )}
          {view === "register" && (
            <RegistrationForm onSwitch={() => setView("login")} />
          )}
          {view === "forgotPassword" && (
            <ForgotPasswordForm onSwitchToLogin={() => setView("login")} />
          )}
        </div>
      </div>
    </div>
  );
};

export default AuthPage;
