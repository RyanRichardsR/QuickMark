import React, { useState } from "react";
import "../AuthForm.css";
import {  } from "../config";
import { Eye, EyeOff } from "lucide-react";

interface LoginFormProps {
  onForgotPassword: () => void;
  onSwitch: () => void;
}

const LoginForm: React.FC<LoginFormProps> = ({
  onForgotPassword,
  onSwitch,
}) => {
  const [message, setMessage] = useState("");
  const [loginName, setLoginName] = useState("");
  const [loginPassword, setPassword] = useState("");
  const [errors, setErrors] = useState<{ login?: string; password?: string }>(
    {}
  );
  const [showPassword, setShowPassword] = useState(false);

  async function doLogin(event: React.FormEvent) {
    event.preventDefault();

    // Check for missing fields and set a combined error message
    if (!loginName && !loginPassword) {
      setMessage("Username and Password are required");
      document.getElementById("login")?.focus();
      return;
    }
    if (!loginName) {
      setMessage("Username is required");
      document.getElementById("login")?.focus();
      return;
    }
    if (!loginPassword) {
      setMessage("Password is required");
      document.getElementById("password")?.focus();
      return;
    }

    const obj = { login: loginName, password: loginPassword };
    const js = JSON.stringify(obj);

    try {
      const response = await fetch(`http://cop4331.xyz/api/login`, {
        method: "POST",
        body: js,
        headers: { "Content-Type": "application/json" },
      });

      const res = await response.json();
      if (res.user && res.user.login && res.user.role && res.user.id) {
        if (res.user.emailVerified === false) {
          setMessage(
            "Your email is not verified. Please check your inbox for the verification link."
          );
          return;
        }

        const user = {
          id: res.user.id,
          firstName: res.user.firstName || "",
          lastName: res.user.lastName || "",
          login: res.user.login,
          role: res.user.role,
        };
        localStorage.setItem("user_data", JSON.stringify(user));
        setMessage("");
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
      <form className="auth-form" onSubmit={doLogin} noValidate>
        <label htmlFor="login" className="auth-label">
          Username:
          <span aria-hidden="true" style={{ color: "red" }}>
            {" "}
            *
          </span>
        </label>
        <input
          type="text"
          id="login"
          className="auth-input"
          placeholder="Username"
          onChange={(e) => {
            setLoginName(e.target.value);
            if (message) setMessage(""); 
          }}
          aria-describedby="loginError"
        />

        <label htmlFor="password" className="auth-label">
          Password:
          <span aria-hidden="true" style={{ color: "red" }}>
            {" "}
            *
          </span>
        </label>
        <div className="password-container">
          <input
            type={showPassword ? "text" : "password"}
            id="password"
            className={`auth-input ${errors.password ? "input-error" : ""}`}
            placeholder="Password"
            onChange={(e) => {
              setPassword(e.target.value);
              setErrors((prevErrors) => ({ ...prevErrors, password: "" }));
            }}
            aria-describedby="passwordError"
            aria-invalid={!!errors.password}
          />
          <span
            className="eye-icon"
            onClick={() => setShowPassword(!showPassword)}
            aria-label="Toggle password visibility"
            role="button"
          >
            {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
          </span>
        </div>
        {errors.password && (
          <span id="passwordError" role="alert" className="error-message">
            {errors.password}
          </span>
        )}

        <button type="submit" className="auth-button">
          Login
        </button>
        {message && (
          <span className="auth-message" role="alert">
            {message}
          </span>
        )}
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
