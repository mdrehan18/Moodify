import React, { useState } from 'react';
import "../style/register.scss";
import FormGroup from '../components/FormGroup';
import { Link, useNavigate } from 'react-router';
import { useAuth } from '../hooks/useAuth';

const Register = () => {

    const [username, setUsername] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [errorMsg, setErrorMsg] = useState("");

    const navigate = useNavigate();
    const { loading, handleRegister } = useAuth();

    async function handleSubmit(e) {
        e.preventDefault();
        setErrorMsg(""); // Reset error message

        try {
            await handleRegister({ username, password, email });
            navigate("/home");
        } catch (err) {
            console.log(err);
            // Extract error message from axios response if available
            if (err.response && err.response.data && err.response.data.message) {
                setErrorMsg(err.response.data.message);
            } else {
                setErrorMsg("Registration failed. Please try again.");
            }
        }
    }

    return (
        <main className="auth-container">
            <div className="auth-card glass-card">
                <div className="auth-header">
                    <h1>Create Account</h1>
                    <p>Join Moodify to discover your vibe</p>
                </div>

                {errorMsg && (
                    <div style={{ color: 'var(--danger-color)', backgroundColor: 'rgba(239, 68, 68, 0.1)', padding: '0.75rem', borderRadius: '8px', fontSize: '0.875rem' }}>
                        {errorMsg}
                    </div>
                )}

                <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                    <FormGroup
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        label="Username"
                        placeholder="Enter your username"
                    />

                    <FormGroup
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        label="Email Address"
                        placeholder="Enter your email"
                    />

                    <FormGroup
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        label="Password"
                        placeholder="Create a password"
                    />

                    <button className='btn-primary' type="submit" disabled={loading}>
                        {loading ? "Creating account..." : "Sign Up for Moodify"}
                    </button>
                </form>

                <div className="auth-footer">
                    <p>
                        Already have an account? <Link to="/login">Login here</Link>
                    </p>
                </div>
            </div>
        </main>
    );
};

export default Register;