import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { SERVER_BASE_URL } from "../config";
import '../styles/ResetPassword.css';


const ResetPassword: React.FC = () => {
    const { token } = useParams(); // Get the token from the URL
    const [password, setPassword] = useState<string>('');
    const [confirmPassword, setConfirmPassword] = useState<string>('');
    const navigate = useNavigate();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (password !== confirmPassword) {
            alert('Passwords do not match');
            return;
        }

        const obj = { password: password };
        const js = JSON.stringify(obj); 

        try {
            const response = await fetch(`${SERVER_BASE_URL}api/resetpassword/${token}`, {
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
                    <form className="reset-password-form" onSubmit={handleSubmit}>
                        <label className="reset-password-label" htmlFor="password">New Password:</label>
                        <input
                            className="reset-password-input"
                            id="password"
                            type="password"
                            placeholder="New Password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />
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
                        <button className="reset-password-button" type="submit">Reset Password</button>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default ResetPassword;