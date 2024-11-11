// ForgotPasswordForm.tsx
import React, { useState } from "react";
import "../AuthForm.css";


interface ForgotPasswordFormProps {
  onSwitchToLogin: () => void;
}

const ForgotPasswordForm: React.FC<ForgotPasswordFormProps> = ({ onSwitchToLogin }) => {
  const [email, setEmail] = useState("");
  const [message] = useState("");

  async function handleForgotPassword(_event: React.FormEvent) {
//implement the handleForgotPassword function
  }

  return (
    <div>
      <h2 className="auth-title">Reset Password</h2>
      <form className="auth-form" onSubmit={handleForgotPassword}>
        <input
          type="email"
          className="auth-input"
          placeholder="Enter your email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <button type="submit" className="auth-button">Send Reset Link</button>
        <span className="auth-message">{message}</span>
      </form>
      <button onClick={onSwitchToLogin} className="toggle-link">
        Back to Login
      </button>
    </div>
  );
};

export default ForgotPasswordForm;
