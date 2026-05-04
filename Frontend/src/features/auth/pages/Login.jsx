import React, { useState } from 'react';
import "../style/login.scss";
import FormGroup from '../components/FormGroup';
import { Link, useNavigate } from 'react-router';
import { useAuth } from '../hooks/useAuth';

const Login = () => {

    const { loading, handleLogin } = useAuth();
    const navigate = useNavigate();

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [errorMsg, setErrorMsg] = useState("");

    async function handleSubmit(e) {
        e.preventDefault();
        setErrorMsg("");

        try {
            await handleLogin({ email, password });
            navigate("/home");
        } catch (err) {
            console.log(err);
            if (err.response && err.response.data && err.response.data.message) {
                setErrorMsg(err.response.data.message);
            } else {
                setErrorMsg("Login failed. Please check your credentials.");
            }
        }
    }

    return (
        <main className="auth-container">
            <div className="auth-card glass-card">
                <div className="auth-header">
                    <h1>Welcome Back</h1>
                    <p>Login to continue your musical journey</p>
                </div>

                {errorMsg && (
                    <div style={{ color: 'var(--danger-color)', backgroundColor: 'rgba(239, 68, 68, 0.1)', padding: '0.75rem', borderRadius: '8px', fontSize: '0.875rem' }}>
                        {errorMsg}
                    </div>
                )}

                <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
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
                        placeholder="Enter your password"
                    />

                    <button className='btn-primary' type="submit" disabled={loading}>
                        {loading ? "Authenticating..." : "Login to Moodify"}
                    </button>
                </form>

                <div className="auth-footer">
                    <p>
                        Don't have an account? <Link to="/register">Register here</Link>
                    </p>
                </div>
            </div>
        </main>
    );
};

export default Login;