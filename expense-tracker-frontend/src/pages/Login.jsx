import { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { toast } from 'react-toastify';
import './Login.css';

function Login() {
    const [formData, setFormData] = useState({ email: '', password: '' });
    const [loading, setLoading] = useState(false);
    const { login } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();

    useEffect(() => {
        const params = new URLSearchParams(location.search);
        if (params.get('demo') === 'true') {
            setFormData({ email: 'demo@example.com', password: 'demo123' });
            handleLogin('demo@example.com', 'demo123');
        }
    }, [location]);

    const handleLogin = async (email, password) => {
        setLoading(true);
        try {
            await login(email, password);
            toast.success('Welcome back!');
            navigate('/dashboard');
        } catch (error) {
            toast.error(error.response?.data || 'Invalid credentials');
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        handleLogin(formData.email, formData.password);
    };

    return (
        <div className="auth-page">
            {/* Left panel */}
            <div className="auth-panel-left">
                <div className="auth-brand">
                    <svg viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg" width="36" height="36">
                        <circle cx="16" cy="16" r="14" stroke="currentColor" strokeWidth="1.5" fill="none" />
                        <path d="M16 9v14M11 12h8a2 2 0 010 4h-6a2 2 0 010 4h9" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                    </svg>
                    <span className="auth-brand-name">ExpenseTracker</span>
                </div>

                <div className="auth-panel-content">
                    <h2 className="auth-panel-title">Take control of<br /><em>your finances</em></h2>
                    <p className="auth-panel-desc">Track spending, set budgets, and gain clarity on where your money actually goes.</p>

                    <div className="auth-features">
                        {[
                            { icon: '📊', text: 'Real-time expense tracking' },
                            { icon: '🎯', text: 'Smart budget alerts' },
                            { icon: '📈', text: 'Monthly reports & insights' },
                        ].map(f => (
                            <div key={f.text} className="auth-feature">
                                <span>{f.icon}</span>
                                <span>{f.text}</span>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="auth-panel-footer">
                    Personal Finance · Smart Tracking
                </div>
            </div>

            {/* Right panel */}
            <div className="auth-panel-right">
                <div className="auth-form-wrap">
                    <div className="auth-form-header">
                        <h1>Sign in</h1>
                        <p>Welcome back — enter your credentials</p>
                    </div>

                    <form onSubmit={handleSubmit} className="auth-form">
                        <div className="form-group">
                            <label className="form-label">Email address</label>
                            <input
                                type="email"
                                className="form-input"
                                value={formData.email}
                                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                required
                                placeholder="you@example.com"
                            />
                        </div>

                        <div className="form-group">
                            <label className="form-label">Password</label>
                            <input
                                type="password"
                                className="form-input"
                                value={formData.password}
                                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                                required
                                placeholder="Enter your password"
                            />
                        </div>

                        <button type="submit" className="btn btn-dark btn-block auth-submit" disabled={loading}>
                            {loading ? <span className="loading-spinner"></span> : 'Sign in →'}
                        </button>

                        <div className="auth-divider">
                            <span>or</span>
                        </div>

                        <button
                            type="button"
                            className="btn btn-outline btn-block demo-btn"
                            onClick={() => {
                                setFormData({ email: 'demo@example.com', password: 'demo123' });
                                handleLogin('demo@example.com', 'demo123');
                            }}
                            disabled={loading}
                        >
                            Try Demo Account →
                        </button>
                    </form>

                    <p className="auth-switch">
                        Don't have an account?{' '}
                        <Link to="/register">Create one</Link>
                    </p>
                </div>
            </div>
        </div>
    );
}

export default Login;
