import React, { useState } from "react";
import "../AuthForm.css";
import { SERVER_BASE_URL } from "../config";

interface LoginFormProps {
  onForgotPassword: () => void;
  onSwitch: () => void;
}

const LoginForm: React.FC<LoginFormProps> = ({ onForgotPassword, onSwitch }) => {
  const [message, setMessage] = useState("");
  const [loginName, setLoginName] = useState("");
  const [loginPassword, setPassword] = useState("");

  async function doLogin(event: React.FormEvent) {
    event.preventDefault();
    const obj = { login: loginName, password: loginPassword };
    const js = JSON.stringify(obj);

    try {
      const response = await fetch(`${SERVER_BASE_URL}api/login`, {
        method: "POST",
        body: js,
        headers: { "Content-Type": "application/json" },
      });

      const res = await response.json();
      if (res.user && res.user.login && res.user.role && res.user.id) {
        const user = {
          id: res.user.id,
          firstName: res.user.firstName || "",
          lastName: res.user.lastName || "",
          login: res.user.login,
          role: res.user.role,
        };
        localStorage.setItem("user_data", JSON.stringify(user));
        window.location.href =
          res.user.role === "teacher" ? "/teacher" : "/student";
      } else {
        setMessage(res.error || "User/Password combination incorrect");
      }
    } catch (error) {
      setMessage("An unknown error occurred.");
    }
  }

  return (
    <div>
      <h2 className="auth-title">Log In</h2>
      <form className="auth-form" onSubmit={doLogin}>
        <input
          type="text"
          className="auth-input"
          placeholder="Username"
          onChange={(e) => setLoginName(e.target.value)}
        />
        <input
          type="password"
          className="auth-input"
          placeholder="Password"
          onChange={(e) => setPassword(e.target.value)}
        />
        <button type="submit" className="auth-button">Login</button>
        <span className="auth-message">{message}</span>
      </form>
      <div className="auth-links">
        <button onClick={onForgotPassword} className="toggle-link">
          Forgot Password?
        </button>
        <button onClick={onSwitch} className="toggle-link">
          Sign Up
        </button>
      </div>
    </div>
  );
};

export default LoginForm;
