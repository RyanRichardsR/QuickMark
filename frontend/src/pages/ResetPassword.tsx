import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import '../styles/ResetPassword.css';


const ResetPassword: React.FC = () => {
    const { token } = useParams(); // Get the token from the URL
    const [message, setMessage] = useState("");
    const [messageType, setMessageType] = useState<"success" | "error" | "">(""); // New state for message type
    const [password, setPassword] = useState<string>('');
    const [confirmPassword, setConfirmPassword] = useState<string>('');
    const navigate = useNavigate();

    const [errors] = useState({
        password: "",
      });

    const passwordRequirements = [
        { id: "uppercase", label: "1 uppercase", isValid: /[A-Z]/.test(password) },
        { id: "lowercase", label: "1 lowercase", isValid: /[a-z]/.test(password) },
        { id: "length", label: "7 characters", isValid: password.length >= 7 },
        { id: "special", label: "1 special character", isValid: /[^a-zA-Z0-9]/.test(password) },
    ];

    const allRequirementsMet = passwordRequirements.every((req) => req.isValid);

    const resetPassword = async (e: React.FormEvent) => {
        e.preventDefault();

        if (password !== confirmPassword) {
            setMessageType("error");
            setMessage("Passwords do not match");
            return;
        }


        if (!password || !allRequirementsMet) {
            setMessageType("error");
            setMessage("Please ensure your new password meets the requirments above");
            return;
          }

        const obj = { password: password };
        const js = JSON.stringify(obj); 

        try {
            const response = await fetch(`http://cop4331.xyz/api/resetpassword/${token}`, {
                method: 'POST',   
                body: js,
                headers: { 'Content-Type': 'application/json' },
            });

            const data = await response.json();
            if (response.ok) {
                alert('Password reset successful');
                navigate('/'); // Redirect to login page
            } else {
                alert(data.message);
            }
        } catch (error) {
            console.error('Error:', error);
        }
    };

    return (
        <div className="reset-password-page">
            <div className="reset-password-container">
                <div className="reset-password-left">
                    <h1>Reset Password</h1>
                    <p>Enter a new password to access your account.</p>
                </div>
                <div className="reset-password-right">
                    <form className="reset-password-form" onSubmit={resetPassword}>
                        <h2 className="reset-password-title">Reset Password</h2>
                        <label className="reset-password-label" htmlFor="password">New Password:</label>
                        <input
                            id="password"
                            type="password"
                            className={`reset-password-input ${errors.password && "input-error"}`}
                            placeholder="New Password"
                            value={password}
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

                        <label className="reset-password-label" htmlFor="confirmPassword">Confirm Password:</label>
                        <input
                            className="reset-password-input"
                            id="confirmPassword"
                            type="password"
                            placeholder="Confirm Password"
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            required
                        />
                         <span className={`auth-message ${messageType === "success" ? "auth-message-success" : "auth-message-error"}`}>
                            {message}
                        </span>
                        <button className="reset-password-button" type="submit">Reset Password</button>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default ResetPassword;