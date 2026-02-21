import { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import './Navbar.css';

function Navbar() {
    const { user, logout } = useAuth();
    const { theme, toggleTheme } = useTheme();
    const navigate = useNavigate();
    const location = useLocation();
    const [scrolled, setScrolled] = useState(false);
    const [mobileOpen, setMobileOpen] = useState(false);

    useEffect(() => {
        const onScroll = () => setScrolled(window.scrollY > 20);
        window.addEventListener('scroll', onScroll);
        return () => window.removeEventListener('scroll', onScroll);
    }, []);

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    const isActive = (path) => location.pathname === path;

    return (
        <nav className={`navbar ${scrolled ? 'navbar-scrolled' : ''}`}>
            <div className="container">
                <div className="navbar-content">

                    {/* Brand */}
                    <Link to="/dashboard" className="navbar-brand">
                        <svg className="brand-icon" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <circle cx="16" cy="16" r="14" stroke="currentColor" strokeWidth="1.5" fill="none" />
                            <path d="M16 9v14M11 12h8a2 2 0 010 4h-6a2 2 0 010 4h9" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                        </svg>
                        <span className="brand-text">
                            <span className="brand-name">Expense</span>
                            <span className="brand-accent">Tracker</span>
                        </span>
                    </Link>

                    {/* Center nav links */}
                    <div className="navbar-links">
                        <Link to="/dashboard" className={`nav-link ${isActive('/dashboard') ? 'active' : ''}`}>
                            Dashboard
                        </Link>
                        <Link to="/transactions" className={`nav-link ${isActive('/transactions') ? 'active' : ''}`}>
                            Transactions
                        </Link>
                        <Link to="/wallets" className={`nav-link ${isActive('/wallets') ? 'active' : ''}`}>
                            Wallets
                        </Link>
                        <Link to="/categories" className={`nav-link ${isActive('/categories') ? 'active' : ''}`}>
                            Categories
                        </Link>
                        <Link to="/budgets" className={`nav-link ${isActive('/budgets') ? 'active' : ''}`}>
                            Budgets
                        </Link>
                    </div>

                    {/* Actions */}
                    <div className="navbar-actions">
                        <button onClick={toggleTheme} className="theme-btn" title="Toggle theme">
                            {theme === 'light' ? (
                                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" width="18" height="18">
                                    <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
                                </svg>
                            ) : (
                                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" width="18" height="18">
                                    <circle cx="12" cy="12" r="5" />
                                    <line x1="12" y1="1" x2="12" y2="3" />
                                    <line x1="12" y1="21" x2="12" y2="23" />
                                    <line x1="4.22" y1="4.22" x2="5.64" y2="5.64" />
                                    <line x1="18.36" y1="18.36" x2="19.78" y2="19.78" />
                                    <line x1="1" y1="12" x2="3" y2="12" />
                                    <line x1="21" y1="12" x2="23" y2="12" />
                                    <line x1="4.22" y1="19.78" x2="5.64" y2="18.36" />
                                    <line x1="18.36" y1="5.64" x2="19.78" y2="4.22" />
                                </svg>
                            )}
                        </button>

                        {user && (
                            <div className="user-menu">
                                <div className="user-avatar">
                                    {user.name?.charAt(0).toUpperCase()}
                                </div>
                                <span className="user-name">{user.name}</span>
                                <button onClick={handleLogout} className="btn btn-dark btn-sm">
                                    Sign out →
                                </button>
                            </div>
                        )}

                        {/* Mobile hamburger */}
                        <button className="mobile-toggle" onClick={() => setMobileOpen(!mobileOpen)}>
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="22" height="22">
                                {mobileOpen
                                    ? <path d="M18 6L6 18M6 6l12 12" />
                                    : <><line x1="3" y1="6" x2="21" y2="6" /><line x1="3" y1="12" x2="21" y2="12" /><line x1="3" y1="18" x2="21" y2="18" /></>
                                }
                            </svg>
                        </button>
                    </div>
                </div>

                {/* Mobile menu */}
                {mobileOpen && (
                    <div className="mobile-menu">
                        {['/dashboard', '/transactions', '/wallets', '/categories', '/budgets'].map((path, i) => (
                            <Link
                                key={path}
                                to={path}
                                className={`mobile-link ${isActive(path) ? 'active' : ''}`}
                                onClick={() => setMobileOpen(false)}
                            >
                                {['Dashboard', 'Transactions', 'Wallets', 'Categories', 'Budgets'][i]}
                            </Link>
                        ))}
                        <button onClick={handleLogout} className="btn btn-dark btn-sm" style={{ marginTop: '8px', width: '100%', justifyContent: 'center' }}>
                            Sign out →
                        </button>
                    </div>
                )}
            </div>
        </nav>
    );
}

export default Navbar;
