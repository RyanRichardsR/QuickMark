import React, { useState } from "react";
import "../AuthForm.css";
import { SERVER_BASE_URL } from "../config";

function LoginForm() {
  const [message, setMessage] = useState("");
  const [loginName, setLoginName] = React.useState("");
  const [loginPassword, setPassword] = React.useState("");

  async function doLogin(event: React.FormEvent) {
    event.preventDefault();

    if (!loginName || !loginPassword) {
      setMessage("Please enter both username and password.");
      return;
    }

    const obj = { login: loginName, password: loginPassword };
    const js = JSON.stringify(obj);

    try {
      const response = await fetch(`${SERVER_BASE_URL}api/login`, {
        method: "POST",
        body: js,
        headers: { "Content-Type": "application/json" },
      });

      const res = await response.json();

      // Ensure redirection only happens if the user is found
      if (res.user && res.user.login && res.user.role && res.user.id) {
        const user = {
          id: res.user.id, // Store `id` in `localStorage`
          firstName: res.user.firstName || "",
          lastName: res.user.lastName || "",
          login: res.user.login,
          role: res.user.role,
        };

        localStorage.setItem("user_data", JSON.stringify(user));
        localStorage.setItem("role", res.user.role); // Store role separately if needed for quick access
        localStorage.setItem("login", res.user.login); // Store login separately if needed for quick access
        setMessage("");
        window.location.href =
          res.user.role === "teacher" ? "/teacher" : "/student";
      } else {
        setMessage(res.error || "User/Password combination incorrect");
      }
    } catch (error) {
      if (error instanceof Error) {
        setMessage(error.message);
      } else {
        setMessage("An unknown error occurred.");
      }
    }
  }

  return (
    <form className="auth-form" onSubmit={doLogin}>
      <h2 className="auth-title">Log In</h2>
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
      <button type="submit" className="auth-button">
        Login
      </button>
      <span className="auth-message">{message}</span>
    </form>
  );
}

export default LoginForm;
