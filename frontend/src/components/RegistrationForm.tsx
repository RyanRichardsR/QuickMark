import React, { useState } from "react";
import "../AuthForm.css";
import { SERVER_BASE_URL } from "../config";

//EMAIL_USER=officialquickmark@gmail.com
//EMAIL_PASS=xjjygcjdylbrciln

interface RegistrationFormProps {
  onSwitch: () => void;
}

const RegistrationForm: React.FC<RegistrationFormProps> = ({ onSwitch }) => {
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState<"success" | "error" | "">(""); // New state for message type
  const [login, setLogin] = useState("");
  const [password, setPassword] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [role, setRole] = useState("user");

  const [errors, setErrors] = useState({
    firstName: "",
    lastName: "",
    login: "",
    password: "",
    email: "",
    role: "",
  });

  const passwordRequirements = [
    { id: "length", label: "7 characters", isValid: password.length >= 7 },
    { id: "uppercase", label: "1 uppercase", isValid: /[A-Z]/.test(password) },
    { id: "lowercase", label: "1 lowercase", isValid: /[a-z]/.test(password) },
    { id: "special", label: "1 special character", isValid: /[^a-zA-Z0-9]/.test(password) },
  ];

  const allRequirementsMet = passwordRequirements.every((req) => req.isValid);
  const roleSelected = role === "teacher" || role === "student";

  const validateForm = () => {
    const newErrors: any = {};
    if (!firstName) newErrors.firstName = "First name is required";
    if (!lastName) newErrors.lastName = "Last name is required";
    if (!login) newErrors.login = "Username is required";
    if (!password) newErrors.password = "Password is required";
    if (!email) newErrors.email = "Email address is required";
    if (!roleSelected) newErrors.role = "Please select either 'Teacher' or 'Student'";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  async function doRegister(event: React.FormEvent) {
    event.preventDefault();
    if (!validateForm() || !allRequirementsMet) {
      setMessageType("error");
      setMessage("Please ensure all fields are filled in correctly.");
      return;
    }

    const obj = { login, password, firstName, lastName, email, role };
    const js = JSON.stringify(obj);

    try {
      const response = await fetch(`${SERVER_BASE_URL}api/register`, {
        method: "POST",
        body: js,
        headers: { "Content-Type": "application/json" },
      });

      const res = await response.json();
      setMessageType(res.success ? "success" : "error");
      setMessage(
        res.success
          ? "Registration successful! Please check your email to verify your account."
          : res.error || "Registration failed. Please try again."
      );
    } catch (error) {
      setMessageType("error");
      setMessage("An error occurred during registration. Please try again.");
    }
  }

  return (
    <div>
      <h2 className="auth-title">Create an Account</h2>
      <form className="auth-form" onSubmit={doRegister}>
        <label htmlFor="firstName" className="auth-label">
          First Name: <span className="required" style={{ color: 'red' }}> *</span>
        </label>
        <input
          type="text"
          id="firstName"
          className={`auth-input ${errors.firstName && "input-error"}`}
          placeholder="First Name"
          onChange={(e) => setFirstName(e.target.value)}
          required
        />
        {errors.firstName && <p className="error-message">{errors.firstName}</p>}

        <label htmlFor="lastName" className="auth-label">
          Last Name: <span className="required" style={{ color: 'red' }}> *</span>
        </label>
        <input
          type="text"
          id="lastName"
          className={`auth-input ${errors.lastName && "input-error"}`}
          placeholder="Last Name"
          onChange={(e) => setLastName(e.target.value)}
          required
        />
        {errors.lastName && <p className="error-message">{errors.lastName}</p>}

        <label htmlFor="username" className="auth-label">
          Username:<span className="required" style={{ color: 'red' }}> *</span>
        </label>
        <input
          type="text"
          id="username"
          className={`auth-input ${errors.login && "input-error"}`}
          placeholder="Username"
          onChange={(e) => setLogin(e.target.value)}
          required
        />
        {errors.login && <p className="error-message">{errors.login}</p>}

        <label htmlFor="password" className="auth-label">
          Password:<span className="required" style={{ color: 'red' }}> *</span>
        </label>
        <input
          type="password"
          id="password"
          className={`auth-input ${errors.password && "input-error"}`}
          placeholder="Password"
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        {errors.password && <p className="error-message">{errors.password}</p>}

        {/* Password Requirements Bubbles */}
        <div className="password-requirements">
          {passwordRequirements.map((requirement) => (
            <div key={requirement.id} className="requirement-item">
              <span
                className={`requirement-bubble ${requirement.isValid ? "filled" : ""}`}
              ></span>
              <span className="requirement-label">{requirement.label}</span>
            </div>
          ))}
        </div>

        <label htmlFor="email" className="auth-label">
          Email Address: <span className="required" style={{ color: 'red' }}> *</span>
        </label>
        <input
          type="email"
          id="email"
          className={`auth-input ${errors.email && "input-error"}`}
          placeholder="Email Address"
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        {errors.email && <p className="error-message">{errors.email}</p>}

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
        {errors.role && <p className="error-message">{errors.role}</p>}

        <button type="submit" className="auth-button">Register</button>
        <span className={`auth-message ${messageType === "success" ? "auth-message-success" : "auth-message-error"}`}>
          {message}
        </span>
      </form>
      <button onClick={onSwitch} className="toggle-link">Already have an account? Login</button>
    </div>
  );
};

export default RegistrationForm;
