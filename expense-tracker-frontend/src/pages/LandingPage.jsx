import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import './LandingPage.css';

function LandingPage() {
    const [stats, setStats] = useState({
        totalBalance: 0,
        totalIncome: 0,
        totalExpenses: 0,
        recentTransactions: []
    });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchDemoStats = async () => {
            try {
                const response = await axios.get('http://localhost:3000/api/auth/demo-stats');
                setStats(response.data);
            } catch (error) {
                console.error('Failed to fetch demo stats:', error);
                // Fallback to dummy data if server is down or demo user not seeded
                setStats({
                    totalBalance: 124850,
                    totalIncome: 184500,
                    totalExpenses: 59650,
                    recentTransactions: [
                        { description: 'Salary Credit', category: 'Salary', amount: 54000, type: 'INCOME' },
                        { description: 'Grocery Store', category: 'Food', amount: 3500, type: 'EXPENSE' },
                        { description: 'Netflix Subscription', category: 'Entertainment', amount: 649, type: 'EXPENSE' }
                    ]
                });
            } finally {
                setLoading(false);
            }
        };
        fetchDemoStats();
    }, []);

    const formatCurrency = (val) => `₹${Number(val).toLocaleString()}`;
    return (
        <div className="landing">

            {/* ── Navbar ── */}
            <nav className="landing-nav">
                <div className="landing-container">
                    <div className="landing-nav-inner">
                        <Link to="/" className="landing-brand">
                            <svg viewBox="0 0 32 32" fill="none" width="28" height="28">
                                <circle cx="16" cy="16" r="14" stroke="#4a7c59" strokeWidth="1.5" />
                                <path d="M16 9v14M11 12h8a2 2 0 010 4h-6a2 2 0 010 4h9" stroke="#4a7c59" strokeWidth="1.5" strokeLinecap="round" />
                            </svg>
                            <span>Expense<span className="brand-g">Tracker</span></span>
                        </Link>

                        <div className="landing-nav-links">
                            <a href="#features" className="landing-nav-link">Features</a>
                            <a href="#how" className="landing-nav-link">How it works</a>
                            <a href="#testimonials" className="landing-nav-link">Reviews</a>
                        </div>

                        <div className="landing-nav-actions">
                            <Link to="/login" className="landing-signin">Sign in</Link>
                            <Link to="/register" className="landing-cta-btn">Get started →</Link>
                        </div>
                    </div>
                </div>
            </nav>

            {/* ── Hero ── */}
            <section className="hero">
                <div className="landing-container">
                    <div className="hero-grid">
                        <div className="hero-text">
                            <div className="hero-pill">
                                <span className="pill-dot"></span>
                                New — Smart budget alerts now live
                            </div>

                            <h1 className="hero-h1">
                                Take control of<br />
                                your <em className="hero-em">finances</em><br />
                                effortlessly
                            </h1>

                            <p className="hero-sub">
                                Track every rupee, set budgets that stick, and unlock insights into
                                your spending — all in one beautifully simple dashboard.
                            </p>

                            <div className="hero-btns">
                                <Link to="/register" className="btn-xl-dark">
                                    Start for free →
                                </Link>
                                <Link to="/login?demo=true" className="btn-xl-ghost">
                                    Try demo account
                                </Link>
                            </div>

                            <div className="hero-social-proof">
                                <div className="avatars">
                                    {['A', 'R', 'P', 'S', 'K'].map((l, i) => (
                                        <div key={i} className="avatar" style={{ background: ['#4a7c59', '#6a9e78', '#5a8a68', '#3d6849', '#7ab58a'][i] }}>
                                            {l}
                                        </div>
                                    ))}
                                </div>
                                <span className="proof-text">Join <strong>2,400+</strong> people tracking smarter</span>
                            </div>
                        </div>

                        <div className="hero-visual">
                            {/* Main dashboard card */}
                            <div className="dashboard-preview">
                                <div className="preview-header">
                                    <div className="preview-dots">
                                        <span></span><span></span><span></span>
                                    </div>
                                    <span className="preview-title">ExpenseTracker</span>
                                </div>

                                <div className="preview-balance">
                                    <div className="pb-label">Total Balance</div>
                                    <div className="pb-amount">{formatCurrency(stats.totalBalance)}</div>
                                    <div className="pb-change">↑ 12% from last month</div>
                                </div>

                                <div className="preview-stats">
                                    <div className="ps-item income">
                                        <div className="ps-icon">↑</div>
                                        <div>
                                            <div className="ps-label">Income</div>
                                            <div className="ps-val">{formatCurrency(stats.totalIncome)}</div>
                                        </div>
                                    </div>
                                    <div className="ps-item expense">
                                        <div className="ps-icon">↓</div>
                                        <div>
                                            <div className="ps-label">Expenses</div>
                                            <div className="ps-val">{formatCurrency(stats.totalExpenses)}</div>
                                        </div>
                                    </div>
                                </div>

                                {/* Mini bar chart */}
                                <div className="preview-chart">
                                    <div className="pc-label">Monthly Trend</div>
                                    <div className="pc-bars">
                                        {[40, 65, 45, 80, 55, 90, 70].map((h, i) => (
                                            <div key={i} className="pc-bar-wrap">
                                                <div
                                                    className={`pc-bar ${i === 5 || i === 6 ? 'pc-bar-accent' : ''}`}
                                                    style={{ height: `${h}%` }}
                                                ></div>
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                <div className="preview-transactions">
                                    {stats.recentTransactions.length > 0 ? stats.recentTransactions.slice(0, 3).map((tx, i) => (
                                        <div key={i} className="preview-tx">
                                            <div className={`tx-dot ${tx.type === 'INCOME' ? 'inc' : 'exp'}`}></div>
                                            <div className="tx-info">
                                                <div className="tx-name">{tx.description}</div>
                                                <div className="tx-cat">{tx.category}</div>
                                            </div>
                                            <div className={`tx-amount ${tx.type === 'INCOME' ? 'inc' : 'exp'}`}>
                                                {tx.type === 'INCOME' ? '+' : '-'}{formatCurrency(tx.amount)}
                                            </div>
                                        </div>
                                    )) : (
                                        <div className="preview-tx" style={{ justifyContent: 'center', color: 'var(--text-muted)', fontSize: '12px' }}>
                                            Loading recent activity...
                                        </div>
                                    )}
                                </div>
                            </div>

                            {/* Floating badges */}
                            <div className="float-badge float-badge-1">
                                <span className="fb-icon">🎯</span>
                                <div>
                                    <div className="fb-title">Budget on track</div>
                                    <div className="fb-sub">82% remaining</div>
                                </div>
                            </div>

                            <div className="float-badge float-badge-2">
                                <span className="fb-icon">📊</span>
                                <div>
                                    <div className="fb-title">Saved ₹8,200</div>
                                    <div className="fb-sub">vs last month</div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Decorative blobs */}
                <div className="blob blob-1"></div>
                <div className="blob blob-2"></div>
            </section>

            {/* ── Live Stats ── */}
            <div className="live-stats-strip">
                <div className="landing-container">
                    <div className="live-stats-inner">
                        <div className="live-stat-item">
                            <div className="ls-val">{formatCurrency(stats.totalIncome + stats.totalExpenses)}</div>
                            <div className="ls-label">Total Volume Tracked</div>
                        </div>
                        <div className="live-stat-divider"></div>
                        <div className="live-stat-item">
                            <div className="ls-val">{formatCurrency(stats.totalBalance)}</div>
                            <div className="ls-label">Current Demo Balance</div>
                        </div>
                        <div className="live-stat-divider"></div>
                        <div className="live-stat-item">
                            <div className="ls-val">{(stats.recentTransactions.length + 150).toLocaleString()}+</div>
                            <div className="ls-label">Transactions Per Month</div>
                        </div>
                    </div>
                </div>
            </div>

            {/* ── Logos strip ── */}
            <div className="logos-strip">
                <div className="landing-container">
                    <p className="logos-label">Trusted by people who use</p>
                    <div className="logos-row">
                        {['HDFC Bank', 'SBI', 'Paytm UPI', 'PhonePe', 'Google Pay', 'ICICI'].map(l => (
                            <div key={l} className="logo-item">{l}</div>
                        ))}
                    </div>
                </div>
            </div>

            {/* ── Features ── */}
            <section className="features-section" id="features">
                <div className="landing-container">
                    <div className="section-header">
                        <div className="section-eyebrow">FEATURES</div>
                        <h2 className="section-title">Everything you need to<br /><em>manage money better</em></h2>
                        <p className="section-sub">No spreadsheets, no confusion — just clear visibility into your finances.</p>
                    </div>

                    <div className="features-grid">
                        {[
                            {
                                icon: (
                                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" width="26" height="26">
                                        <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm.31-8.86c-1.77-.45-2.34-.94-2.34-1.67 0-.84.79-1.43 2.1-1.43 1.38 0 1.9.66 1.94 1.64h1.71c-.05-1.34-.87-2.57-2.49-2.97V5H10.9v1.69c-1.51.32-2.72 1.3-2.72 2.81 0 1.79 1.49 2.69 3.66 3.21 1.95.46 2.34 1.15 2.34 1.86 0 .53-.39 1.39-2.1 1.39-1.6 0-2.23-.72-2.32-1.64H8.04c.1 1.7 1.36 2.66 2.86 2.97V19h2.34v-1.67c1.52-.29 2.72-1.16 2.73-2.77-.01-2.2-1.9-2.96-3.66-3.42z" />
                                    </svg>
                                ),
                                title: 'Multi-Wallet Tracking',
                                desc: 'Track cash, bank accounts, UPI, and credit cards all in one place with a unified balance view.',
                                color: 'green',
                            },
                            {
                                icon: (
                                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" width="26" height="26">
                                        <rect x="3" y="3" width="18" height="18" rx="3" />
                                        <path d="M9 9h6M9 12h6M9 15h4" />
                                    </svg>
                                ),
                                title: 'Smart Categories',
                                desc: 'Auto-categorize transactions into food, travel, entertainment, and custom categories you define.',
                                color: 'amber',
                            },
                            {
                                icon: (
                                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" width="26" height="26">
                                        <path d="M12 20V10M18 20V4M6 20v-4" />
                                    </svg>
                                ),
                                title: 'Reports & Analytics',
                                desc: 'Visual charts showing income vs expense trends, top spending categories, and monthly comparisons.',
                                color: 'blue',
                            },
                            {
                                icon: (
                                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" width="26" height="26">
                                        <circle cx="12" cy="12" r="10" />
                                        <path d="M12 8v4l3 3" />
                                    </svg>
                                ),
                                title: 'Budget Alerts',
                                desc: 'Set monthly budgets per category and get notified before you overspend. Stay on track every month.',
                                color: 'rose',
                            },
                            {
                                icon: (
                                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" width="26" height="26">
                                        <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
                                        <circle cx="9" cy="7" r="4" />
                                        <path d="M23 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75" />
                                    </svg>
                                ),
                                title: 'Secure & Private',
                                desc: 'Your financial data is encrypted and stored securely. We never share data with third parties.',
                                color: 'green',
                            },
                            {
                                icon: (
                                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" width="26" height="26">
                                        <polyline points="22 12 18 12 15 21 9 3 6 12 2 12" />
                                    </svg>
                                ),
                                title: 'Real-time Sync',
                                desc: 'All your data syncs instantly across sessions. Add a transaction from anywhere, see it everywhere.',
                                color: 'amber',
                            },
                        ].map((f, i) => (
                            <div key={i} className={`feature-card feature-card--${f.color}`}>
                                <div className={`feature-icon feature-icon--${f.color}`}>
                                    {f.icon}
                                </div>
                                <h3 className="feature-title">{f.title}</h3>
                                <p className="feature-desc">{f.desc}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* ── How it works ── */}
            <section className="how-section" id="how">
                <div className="landing-container">
                    <div className="section-header">
                        <div className="section-eyebrow">HOW IT WORKS</div>
                        <h2 className="section-title">Up and tracking in<br /><em>3 simple steps</em></h2>
                    </div>

                    <div className="steps-grid">
                        {[
                            {
                                num: '01',
                                title: 'Create your account',
                                desc: 'Sign up in under 60 seconds. No credit card required. Just your name and email.',
                                action: 'Create account →',
                                href: '/register',
                            },
                            {
                                num: '02',
                                title: 'Add your wallets',
                                desc: 'Connect your bank accounts, UPI wallets, and cash holdings to get a complete picture.',
                                action: null,
                            },
                            {
                                num: '03',
                                title: 'Track & grow',
                                desc: 'Log transactions, set budgets, and watch your savings grow with monthly insights.',
                                action: null,
                            },
                        ].map((s, i) => (
                            <div key={i} className="step-card">
                                <div className="step-num">{s.num}</div>
                                <div className="step-connector"></div>
                                <h3 className="step-title">{s.title}</h3>
                                <p className="step-desc">{s.desc}</p>
                                {s.action && (
                                    <Link to={s.href} className="step-action">{s.action}</Link>
                                )}
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* ── Testimonials ── */}
            <section className="testimonials-section" id="testimonials">
                <div className="landing-container">
                    <div className="section-header">
                        <div className="section-eyebrow">REVIEWS</div>
                        <h2 className="section-title">People love it</h2>
                    </div>

                    <div className="testimonials-grid">
                        {[
                            {
                                quote: "I finally know where my salary disappears every month. ExpenseTracker showed me I was spending ₹8,000 on food delivery alone!",
                                name: "Priya S.",
                                role: "Software Engineer",
                                avatar: "P",
                            },
                            {
                                quote: "The budget alerts saved me from overspending on entertainment twice this month. Genuinely changed how I think about money.",
                                name: "Arjun M.",
                                role: "Freelance Designer",
                                avatar: "A",
                            },
                            {
                                quote: "Clean, simple, and actually useful. I've tried 4 finance apps before this — none of them felt this effortless.",
                                name: "Kavya R.",
                                role: "Medical Student",
                                avatar: "K",
                            },
                        ].map((t, i) => (
                            <div key={i} className="testimonial-card">
                                <div className="stars">{'★★★★★'}</div>
                                <p className="testimonial-quote">"{t.quote}"</p>
                                <div className="testimonial-author">
                                    <div className="testimonial-avatar">{t.avatar}</div>
                                    <div>
                                        <div className="author-name">{t.name}</div>
                                        <div className="author-role">{t.role}</div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* ── CTA ── */}
            <section className="cta-section">
                <div className="landing-container">
                    <div className="cta-card">
                        <div className="cta-glow"></div>
                        <div className="cta-content">
                            <h2 className="cta-title">Ready to take control<br />of your <em>money</em>?</h2>
                            <p className="cta-sub">Join thousands of people already tracking smarter. Free forever.</p>
                            <div className="cta-btns">
                                <Link to="/register" className="btn-xl-white">Create free account →</Link>
                                <Link to="/login?demo=true" className="btn-xl-ghost-white">Try demo account</Link>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* ── Footer ── */}
            <footer className="landing-footer">
                <div className="landing-container">
                    <div className="footer-inner">
                        <div className="footer-brand">
                            <svg viewBox="0 0 32 32" fill="none" width="22" height="22">
                                <circle cx="16" cy="16" r="14" stroke="#4a7c59" strokeWidth="1.5" />
                                <path d="M16 9v14M11 12h8a2 2 0 010 4h-6a2 2 0 010 4h9" stroke="#4a7c59" strokeWidth="1.5" strokeLinecap="round" />
                            </svg>
                            <span>ExpenseTracker</span>
                        </div>
                        <p className="footer-copy">© 2026 ExpenseTracker. Made with ♥ for better finances.</p>
                        <div className="footer-links">
                            <Link to="/login">Login</Link>
                            <Link to="/register">Register</Link>
                        </div>
                    </div>
                </div>
            </footer>
        </div>
    );
}

export default LandingPage;
