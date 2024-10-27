import React, { useState } from "react";
import "../AuthForm.css";

function RegistrationForm() {
  const [message, setMessage] = useState("");
  const [login, setLogin] = useState("");
  const [password, setPassword] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [role, setRole] = useState("user"); // Default role set to "user"
  const [verified, setVerified] = useState(false); // Default verified status

  async function doRegister(event: React.FormEvent) {
    event.preventDefault();

    const obj = { login, password, firstName, lastName, email, role, verified };
    const js = JSON.stringify(obj);

    try {
      const response = await fetch("http://localhost:3000/api/register", {
        method: "POST",
        body: js,
        headers: { "Content-Type": "application/json" },
      });

      const res = await response.json();

      if (res.error) {
        setMessage("Registration failed. Please try again.");
      } else {
        setMessage("Registration successful! You can now log in.");
      }
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
          className={`role-button ${role === "Teacher" ? "selected" : ""}`}
          onClick={() => setRole("Teacher")}
        >
          Teacher
        </button>
        <button
          type="button"
          className={`role-button ${role === "Student" ? "selected" : ""}`}
          onClick={() => setRole("Student")}
        >
          Student
        </button>
      </div>
      
        <button type="submit" className="auth-button">Register</button>
        <span className="auth-message">{message}</span>
      </form>
    </div>
  );
}

export default RegistrationForm;
