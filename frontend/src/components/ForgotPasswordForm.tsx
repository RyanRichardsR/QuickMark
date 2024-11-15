import React, { useState } from "react";
import { SERVER_BASE_URL } from "../config";
import "../AuthForm.css";

interface ForgotPasswordFormProps {
  onSwitchToLogin: () => void;
}

const ForgotPasswordForm: React.FC<ForgotPasswordFormProps> = ({ onSwitchToLogin }) => {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState<"success" | "error" | "">("");
  const [loading, setLoading] = useState(false);

  async function handleForgotPassword(event: React.FormEvent) {
    event.preventDefault();
    setLoading(true);
    setMessage("");
    setMessageType(""); // Clear the message type on new submission

    try {
      const response = await fetch(`http://cop4331.xyz/api/forgotPassword`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
  
      const data = await response.json();
      console.log("Response Data:", data); // Keep for debugging
  
      if (data.error) {
        setMessage(data.error || "Error sending reset link. Please try again.");
        setMessageType("error"); // Set message type to error
      } else {
        setMessage("Password reset link sent. Please check your email.");
        setMessageType("success"); // Set message type to success
      }
    } catch (error) {
      console.error("Error:", error);
      setMessage("An error occurred. Please try again later.");
      setMessageType("error"); // Set message type to error
    } finally {
      setLoading(false);
    }
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
        <button type="submit" className="auth-button" disabled={loading}>
          {loading ? "Sending..." : "Send Reset Link"}
        </button>
        <span
          className={`auth-message ${messageType === "success" ? "auth-message-success" : "auth-message-error"}`}
        >
          {message}
        </span>
      </form>
      <button onClick={onSwitchToLogin} className="toggle-link">
        Back to Login
      </button>
    </div>
  );
};

export default ForgotPasswordForm;
