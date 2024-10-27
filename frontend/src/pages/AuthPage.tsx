import React, { useState } from "react";
import LoginForm from "../components/LoginForm";
import RegistrationForm from "../components/RegistrationForm";
import "../AuthPage.css";

const AuthPage = () => {
  const [isLogin, setIsLogin] = useState(true);

  return (
    <div className="auth-page">
      <div className="auth-container">
        {/* Left Section with Welcome Message */}
        <div className="auth-left">
          <h1>Welcome to QuickMark</h1>
          <p>Your smart attendance tracker</p>
        </div>
        
        {/* Right Section with Login Form */}
        <div className="auth-right">
          {isLogin ? <LoginForm /> : <RegistrationForm />}
          <div className="auth-footer">
            {isLogin ? "Don't have an account? " : "Already have an account? "}
            <button onClick={() => setIsLogin(!isLogin)} className="toggle-link">
              {isLogin ? "Sign Up" : "Login"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AuthPage;
