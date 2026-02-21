import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { dashboardAPI } from '../services/api';
import { toast } from 'react-toastify';
import Navbar from '../components/Navbar';
import './Dashboard.css';

function Dashboard() {
    const [summary, setSummary] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchSummary();
    }, []);

    const fetchSummary = async () => {
        try {
            const response = await dashboardAPI.getSummary();
            setSummary(response.data);
        } catch (error) {
            toast.error('Failed to load dashboard');
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <>
                <Navbar />
                <div className="dashboard-loading">
                    <div className="loading-dots">
                        <span></span><span></span><span></span>
                    </div>
                    <p>Loading your finances…</p>
                </div>
            </>
        );
    }

    return (
        <>
            <Navbar />

            {/* ── Hero Section ── */}
            <section className="hero-section">
                <div className="container">
                    <div className="hero-inner">
                        <div className="hero-left">
                            <div className="hero-eyebrow">
                                <span className="eyebrow-line"></span>
                                <span>PERSONAL FINANCE · SMART TRACKING</span>
                            </div>

                            <h1 className="hero-title">
                                Track your{' '}
                                <span className="hero-accent">smart</span>
                                <br />
                                Expense
                                <br />
                                Decisions
                            </h1>

                            <p className="hero-subtitle">
                                Monitor your income and expenses in real time — get instant clarity on your
                                spending habits with <strong>category-based tracking</strong> and smart
                                budget alerts tailored to your financial goals.
                            </p>

                            <div className="hero-actions">
                                <Link to="/transactions" className="btn btn-dark hero-btn-primary">
                                    Add Transaction →
                                </Link>
                                <Link to="/reports" className="hero-link">
                                    View Reports
                                </Link>
                            </div>
                        </div>

                        <div className="hero-right">
                            <div className="hero-visual">
                                {/* Decorative finance illustration */}
                                <svg viewBox="0 0 520 480" fill="none" xmlns="http://www.w3.org/2000/svg" className="hero-svg">
                                    {/* Background blobs */}
                                    <ellipse cx="280" cy="240" rx="200" ry="200" fill="rgba(74,124,89,0.06)" />
                                    <ellipse cx="320" cy="200" rx="140" ry="140" fill="rgba(74,124,89,0.05)" />

                                    {/* Main coin */}
                                    <circle cx="260" cy="220" r="110" stroke="#4a7c59" strokeWidth="2" fill="rgba(74,124,89,0.06)" />
                                    <circle cx="260" cy="220" r="88" stroke="#4a7c59" strokeWidth="1" strokeDasharray="4 6" fill="none" opacity="0.5" />

                                    {/* rupee symbol */}
                                    <text x="220" y="248" fontFamily="Georgia, serif" fontSize="80" fill="#4a7c59" opacity="0.7" fontWeight="300">₹</text>

                                    {/* Floating card 1 - balance */}
                                    <rect x="30" y="80" width="160" height="80" rx="14" fill="white" filter="url(#s1)" />
                                    <rect x="30" y="80" width="160" height="80" rx="14" stroke="#e8e6e1" strokeWidth="1" fill="white" />
                                    <text x="48" y="108" fontFamily="Inter,sans-serif" fontSize="11" fill="#9d9b96">TOTAL BALANCE</text>
                                    <text x="48" y="132" fontFamily="Inter,sans-serif" fontSize="20" fill="#1c1c1a" fontWeight="600">₹1,24,500</text>
                                    <circle cx="160" cy="108" r="16" fill="rgba(74,124,89,0.12)" />
                                    <text x="153" y="113" fontSize="14" fill="#4a7c59">↑</text>

                                    {/* Floating card 2 - income */}
                                    <rect x="340" y="60" width="150" height="72" rx="14" fill="white" stroke="#e8e6e1" strokeWidth="1" />
                                    <text x="358" y="86" fontFamily="Inter,sans-serif" fontSize="10" fill="#9d9b96">INCOME</text>
                                    <text x="358" y="108" fontFamily="Inter,sans-serif" fontSize="17" fill="#4a7c59" fontWeight="600">+₹54,000</text>

                                    {/* Floating card 3 - expense */}
                                    <rect x="350" y="350" width="150" height="72" rx="14" fill="white" stroke="#e8e6e1" strokeWidth="1" />
                                    <text x="368" y="376" fontFamily="Inter,sans-serif" fontSize="10" fill="#9d9b96">EXPENSES</text>
                                    <text x="368" y="398" fontFamily="Inter,sans-serif" fontSize="17" fill="#c0392b" fontWeight="600">-₹28,400</text>

                                    {/* Mini bar chart */}
                                    <rect x="40" y="320" width="180" height="110" rx="14" fill="white" stroke="#e8e6e1" strokeWidth="1" />
                                    <text x="58" y="344" fontFamily="Inter,sans-serif" fontSize="10" fill="#9d9b96">MONTHLY TREND</text>
                                    {[0, 1, 2, 3, 4, 5].map((i) => {
                                        const h = [30, 48, 36, 56, 42, 60][i];
                                        return null; // SVG rendered statically below
                                    })}
                                    <rect x="58" y="393" width="14" height="30" rx="3" fill="#d4e8db" />
                                    <rect x="78" y="376" width="14" height="47" rx="3" fill="#4a7c59" />
                                    <rect x="98" y="385" width="14" height="38" rx="3" fill="#d4e8db" />
                                    <rect x="118" y="367" width="14" height="56" rx="3" fill="#4a7c59" />
                                    <rect x="138" y="379" width="14" height="44" rx="3" fill="#d4e8db" />
                                    <rect x="158" y="360" width="14" height="63" rx="3" fill="#4a7c59" />

                                    {/* Connection dots */}
                                    <circle cx="190" cy="120" r="5" fill="#4a7c59" opacity="0.4" />
                                    <circle cx="350" cy="200" r="4" fill="#4a7c59" opacity="0.3" />
                                    <circle cx="130" cy="310" r="6" fill="#4a7c59" opacity="0.2" />
                                    <circle cx="420" cy="300" r="5" fill="#4a7c59" opacity="0.3" />

                                    <defs>
                                        <filter id="s1" x="-20%" y="-20%" width="140%" height="140%">
                                            <feDropShadow dx="0" dy="4" stdDeviation="8" floodColor="#1c1c1a" floodOpacity="0.08" />
                                        </filter>
                                    </defs>
                                </svg>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Scroll indicator */}
                <div className="scroll-indicator">
                    <span>SCROLL</span>
                    <div className="scroll-line"></div>
                </div>
            </section>

            {/* ── Stats Section ── */}
            <section className="stats-section">
                <div className="container">
                    <div className="stats-grid">
                        <div className="stat-card stat-card--health">
                            <div className="stat-icon stat-icon--health">
                                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" width="22" height="22">
                                    <path d="M12 2L4.5 20.29l.71.71L12 18l6.79 3 .71-.71L12 2z" />
                                </svg>
                            </div>
                            <div className="stat-content">
                                <div className="stat-label">Financial Health</div>
                                <div className="stat-value health-value">{summary?.ai?.healthScore || '0'}<span className="health-max">/100</span></div>
                            </div>
                            <div className={`stat-personality ${summary?.ai?.personality?.toLowerCase().replace(' ', '-')}`}>
                                {summary?.ai?.personality || 'Balanced Spender'}
                            </div>
                        </div>

                        <div className="stat-card">
                            <div className="stat-icon stat-icon--balance">
                                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" width="22" height="22">
                                    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm.31-8.86c-1.77-.45-2.34-.94-2.34-1.67 0-.84.79-1.43 2.1-1.43 1.38 0 1.9.66 1.94 1.64h1.71c-.05-1.34-.87-2.57-2.49-2.97V5H10.9v1.69c-1.51.32-2.72 1.3-2.72 2.81 0 1.79 1.49 2.69 3.66 3.21 1.95.46 2.34 1.15 2.34 1.86 0 .53-.39 1.39-2.1 1.39-1.6 0-2.23-.72-2.32-1.64H8.04c.1 1.7 1.36 2.66 2.86 2.97V19h2.34v-1.67c1.52-.29 2.72-1.16 2.73-2.77-.01-2.2-1.9-2.96-3.66-3.42z" />
                                </svg>
                            </div>
                            <div className="stat-content">
                                <div className="stat-label">Total Balance</div>
                                <div className="stat-value">₹{summary?.totalBalance?.toLocaleString('en-IN') || '0'}</div>
                            </div>
                            <div className="stat-trend stat-trend--neutral">All wallets</div>
                        </div>

                        <div className="stat-card stat-card--income">
                            <div className="stat-icon stat-icon--income">
                                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" width="22" height="22">
                                    <polyline points="23 6 13.5 15.5 8.5 10.5 1 18" />
                                    <polyline points="17 6 23 6 23 12" />
                                </svg>
                            </div>
                            <div className="stat-content">
                                <div className="stat-label">Total Income</div>
                                <div className="stat-value income-value">₹{summary?.totalIncome?.toLocaleString('en-IN') || '0'}</div>
                            </div>
                            <div className="stat-trend stat-trend--up">↑ {summary?.ai?.savingsRate}% savings</div>
                        </div>

                        <div className="stat-card stat-card--expense">
                            <div className="stat-icon stat-icon--expense">
                                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" width="22" height="22">
                                    <polyline points="23 18 13.5 8.5 8.5 13.5 1 6" />
                                    <polyline points="17 18 23 18 23 12" />
                                </svg>
                            </div>
                            <div className="stat-content">
                                <div className="stat-label">Total Expenses</div>
                                <div className="stat-value expense-value">₹{summary?.totalExpenses?.toLocaleString('en-IN') || '0'}</div>
                            </div>
                            <div className="stat-trend stat-trend--down">↓ This month</div>
                        </div>
                    </div>

                    {/* Quick Actions */}
                    <div className="quick-section">
                        <div className="quick-card">
                            <div className="quick-title">Get Started</div>
                            <p className="quick-desc">Manage your finances effortlessly — add wallets, set budgets, and track every transaction.</p>
                            <div className="quick-actions">
                                <Link to="/transactions" className="btn btn-primary">Add Transaction</Link>
                                <Link to="/wallets" className="btn btn-ghost">Manage Wallets</Link>
                                <Link to="/reports" className="btn btn-ghost">View Reports</Link>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </>
    );
}

export default Dashboard;
