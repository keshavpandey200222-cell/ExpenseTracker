import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { toast } from 'react-toastify';
import './Login.css';

function Register() {
    const [formData, setFormData] = useState({ name: '', email: '', password: '' });
    const [loading, setLoading] = useState(false);
    const { register } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            await register(formData.name, formData.email, formData.password);
            toast.success('Account created successfully!');
            navigate('/dashboard');
        } catch (error) {
            toast.error(error.response?.data || 'Registration failed');
        } finally {
            setLoading(false);
        }
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
                    <h2 className="auth-panel-title">Start your<br /><em>financial journey</em></h2>
                    <p className="auth-panel-desc">Join thousands who track their finances smarter. Set up in under 2 minutes.</p>

                    <div className="auth-features">
                        {[
                            { icon: '✅', text: 'Completely free to use' },
                            { icon: '🔒', text: 'Your data stays private' },
                            { icon: '📱', text: 'Works on all devices' },
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
                        <h1>Create account</h1>
                        <p>Get started with your free account</p>
                    </div>

                    <form onSubmit={handleSubmit} className="auth-form">
                        <div className="form-group">
                            <label className="form-label">Full Name</label>
                            <input
                                type="text"
                                className="form-input"
                                value={formData.name}
                                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                required
                                placeholder="John Doe"
                            />
                        </div>

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
                                placeholder="At least 6 characters"
                                minLength={6}
                            />
                        </div>

                        <button type="submit" className="btn btn-dark btn-block auth-submit" disabled={loading}>
                            {loading ? <span className="loading-spinner"></span> : 'Create account →'}
                        </button>
                    </form>

                    <p className="auth-switch">
                        Already have an account?{' '}
                        <Link to="/login">Sign in</Link> or <Link to="/login?demo=true">Try demo</Link>
                    </p>
                </div>
            </div>
        </div>
    );
}

export default Register;
