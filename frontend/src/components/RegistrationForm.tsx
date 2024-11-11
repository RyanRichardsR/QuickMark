import React, { useState } from "react";
import "../AuthForm.css";
import { SERVER_BASE_URL } from "../config";

//EMAIL_USER=officialquickmark@gmail.com
//EMAIL_PASS=xjjygcjdylbrciln


//EMAIL_USER=officialquickmark@gmail.com
//EMAIL_PASS=xjjygcjdylbrciln


interface RegistrationFormProps {
  onSwitch: () => void;
}

const RegistrationForm: React.FC<RegistrationFormProps> = ({ onSwitch }) => {
  const [message, setMessage] = useState("");
  const [error, setError] = useState(""); // New error state
  const [login, setLogin] = useState("");
  const [password, setPassword] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [role, setRole] = useState("user");

  const passwordRequirements = [
    { id: "length", label: "7 characters", isValid: password.length >= 7 },
    { id: "uppercase", label: "1 uppercase", isValid: /[A-Z]/.test(password) },
    { id: "lowercase", label: "1 lowercase", isValid: /[a-z]/.test(password) },
    { id: "special", label: "1 special character", isValid: /[^a-zA-Z0-9]/.test(password) },
  ];

  const allRequirementsMet = passwordRequirements.every(req => req.isValid);
  const roleSelected = role === "teacher" || role === "student";

  async function doRegister(event: React.FormEvent) {
    event.preventDefault();
    if (!allRequirementsMet) {
      setError("Please ensure your password meets all requirements.");
      return;
    }
    if (!roleSelected) {
      setError("Please select either 'Teacher' or 'Student' as your role.");
      return;
    }

    setError(""); // Clear error if all conditions are met

    const obj = { login, password, firstName, lastName, email, role  };
    const js = JSON.stringify(obj);

    try {
      const response = await fetch(`${SERVER_BASE_URL}api/register`, {
        method: "POST",
        body: js,
        headers: { "Content-Type": "application/json" },
      });

      const res = await response.json();
      if (res.success) {
        setMessage("Registration successful! Please check your email to verify your account.");
      } else {
        setMessage(res.error || "Registration failed. Please try again.");
      }
      setMessage(
        res.success
          ? "Registration successful! Please check your email to verify your account."
          : res.error || "Registration failed. Please try again."
      );
    } catch (error) {
      setMessage("An error occurred during registration. Please try again.");
    }
  }

  return (
    <div>
      <h2 className="auth-title">Create an Account</h2>
      <form className="auth-form" onSubmit={doRegister}>
          <input
          type="text"
          className="auth-input"
          placeholder="First Name"
          onChange={(e) => setFirstName(e.target.value)}
          required
        />
        <input
          type="text"
          className="auth-input"
          placeholder="Last Name"
          onChange={(e) => setLastName(e.target.value)}
          required
        />
        <input
          type="text"
          className="auth-input"
          placeholder="Username"
          onChange={(e) => setLogin(e.target.value)}
          required
        />

        {/* Password Requirements Bubbles */}
        <div className="password-requirements">
          {passwordRequirements.map((requirement) => (
            <div key={requirement.id} className="requirement-item">
              <span
                className={`requirement-bubble ${
                  requirement.isValid ? "filled" : ""
                }`}
              ></span>
              <span className="requirement-label">{requirement.label}</span>
            </div>
          ))}
        </div>

        <input
          type="password"
          className="auth-input"
          placeholder="Password"
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <input
          type="email"
          className="auth-input"
          placeholder="Email Address"
          onChange={(e) => setEmail(e.target.value)}
          required
        />

        {/* Role Selection */}
        <div className="role-buttons">
          <button
            type="button"
            className={`role-button ${role === "teacher" ? "selected" : ""}`}
            onClick={() => setRole("teacher")}
          >
            Teacher
          </button>
          <button
            type="button"
            className={`role-button ${role === "student" ? "selected" : ""}`}
            onClick={() => setRole("student")}
          >
            Student
          </button>
        </div>

        {/* Display Error Message if Requirements are Unmet */}
        {error && <p className="error-message">{error}</p>}
        
        <button type="submit" className="auth-button">Register</button>
        <span className="auth-message">{message}</span>
      </form>
      <button onClick={onSwitch} className="toggle-link">Already have an account? Login</button>
    </div>
  );
};

export default RegistrationForm;
