import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { SERVER_BASE_URL } from "../config";


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
        <div>
            <h2>Reset Password</h2>
            <form onSubmit={handleSubmit}>
                <input
                    type="password"
                    placeholder="New Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                />
                <input
                    type="password"
                    placeholder="Confirm Password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    required
                />
                <button type="submit">Reset Password</button>
            </form>
        </div>
    );
};

export default ResetPassword;