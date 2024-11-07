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

  async function doRegister(event: React.FormEvent) {
    console.log("doRegister is called");

    event.preventDefault();

    const obj = { login, password, firstName, lastName, email, role};
    const js = JSON.stringify(obj);

    try {
      const response = await fetch("http://localhost:3000/api/register", {
        method: "POST",
        body: js,
        headers: { "Content-Type": "application/json" },
      });

      const res = await response.json();
      // Check if registration was successful
      if (res.success) {
        setMessage("Registration successful! Please check your email to verify your account.");
      } else {
        // Display server error message if registration fails
        setMessage(res.error || "Registration failed. Please try again.");
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

        <button type="submit" className="auth-button">Register</button>
        <span className="auth-message">{message}</span>
      </form>
    </div>
  );
}

export default RegistrationForm;
