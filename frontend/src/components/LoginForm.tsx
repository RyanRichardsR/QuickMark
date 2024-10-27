import React, { useState } from "react";
import "../AuthForm.css";

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
        const response = await fetch("http://localhost:3000/api/login", {
            method: "POST",
            body: js,
            headers: { "Content-Type": "application/json" },
        });

        const res = await response.json();

        // Ensure redirection only happens if the user is found
        if (res.user && res.user.id) {
            const user = {
                firstName: res.user.firstName,
                lastName: res.user.lastName,
                id: res.user.id,
            };
            localStorage.setItem("user_data", JSON.stringify(user));
            setMessage("");
            window.location.href = "/cards";
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
      <button type="submit" className="auth-button">Login</button>
      <span className="auth-message">{message}</span>
    </form>
  );

}

export default LoginForm;
