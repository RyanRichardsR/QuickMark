import React, { useState } from "react";
import "../AuthForm.css";
import { SERVER_BASE_URL } from "../config";

interface RegistrationFormProps {
  onSwitch: () => void;
}

const RegistrationForm: React.FC<RegistrationFormProps> = ({ onSwitch }) => {
  const [message, setMessage] = useState("");
  const [login, setLogin] = useState("");
  const [password, setPassword] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [role, setRole] = useState("user");

  async function doRegister(event: React.FormEvent) {
    event.preventDefault();
    const obj = { login, password, firstName, lastName, email, role };
    const js = JSON.stringify(obj);

    try {
      const response = await fetch(`${SERVER_BASE_URL}api/register`, {
        method: "POST",
        body: js,
        headers: { "Content-Type": "application/json" },
      });

      const res = await response.json();
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
        <button type="submit" className="auth-button">Register</button>
        <span className="auth-message">{message}</span>
      </form>
      <button onClick={onSwitch} className="toggle-link">Already have an account? Login</button>
    </div>
  );
};

export default RegistrationForm;
