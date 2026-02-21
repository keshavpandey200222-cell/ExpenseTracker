import { useState, useEffect } from 'react';
import { transactionAPI, dashboardAPI } from '../services/api';
import { toast } from 'react-toastify';
import Navbar from '../components/Navbar';
import { LineChart, Line, PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import './Reports.css';

function Reports() {
    const [transactions, setTransactions] = useState([]);
    const [aiInsights, setAiInsights] = useState([]);
    const [loading, setLoading] = useState(true);
    const [period, setPeriod] = useState('month');

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            try {
                const now = new Date();
                let startDate, endDate;

                if (period === 'week') {
                    const day = now.getDay();
                    const diff = now.getDate() - day + (day === 0 ? -6 : 1);
                    startDate = new Date(now.setDate(diff)).toISOString().split('T')[0];
                    endDate = new Date().toISOString().split('T')[0];
                } else if (period === 'month') {
                    startDate = new Date(now.getFullYear(), now.getMonth(), 1).toISOString().split('T')[0];
                    endDate = new Date(now.getFullYear(), now.getMonth() + 1, 0).toISOString().split('T')[0];
                } else {
                    startDate = new Date(now.getFullYear(), 0, 1).toISOString().split('T')[0];
                    endDate = new Date(now.getFullYear(), 11, 31).toISOString().split('T')[0];
                }

                const [txResponse, dashResponse] = await Promise.all([
                    transactionAPI.getAll({ startDate, endDate }),
                    dashboardAPI.getSummary()
                ]);

                setTransactions(txResponse.data);
                setAiInsights(dashResponse.data.ai?.insights || []);
            } catch (error) {
                toast.error('Failed to load data');
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [period]);

    const calculateStats = () => {
        const income = transactions.filter(t => t.type === 'INCOME').reduce((sum, t) => sum + t.amount, 0);
        const expense = transactions.filter(t => t.type === 'EXPENSE').reduce((sum, t) => sum + t.amount, 0);

        const categoryStats = {};
        transactions.forEach(t => {
            const catName = t.category?.name || 'Uncategorized';
            if (!categoryStats[catName]) {
                categoryStats[catName] = { amount: 0, count: 0, type: t.type };
            }
            categoryStats[catName].amount += t.amount;
            categoryStats[catName].count += 1;
        });

        return { income, expense, categoryStats };
    };

    const getChartData = () => {
        const groupedData = {};
        transactions.forEach(t => {
            const date = new Date(t.transactionDate);
            let key;

            if (period === 'week') {
                key = date.toLocaleDateString('en-IN', { weekday: 'short' });
            } else if (period === 'month') {
                key = `Day ${date.getDate()}`;
            } else {
                key = date.toLocaleDateString('en-IN', { month: 'short' });
            }

            if (!groupedData[key]) {
                groupedData[key] = { label: key, income: 0, expense: 0, rawDate: date };
            }

            if (t.type === 'INCOME') {
                groupedData[key].income += t.amount;
            } else {
                groupedData[key].expense += t.amount;
            }
        });

        return Object.values(groupedData).sort((a, b) => a.rawDate - b.rawDate);
    };

    const getCategoryChartData = () => {
        const { categoryStats } = calculateStats();
        return Object.entries(categoryStats)
            .filter(([_, data]) => data.type === 'EXPENSE')
            .map(([name, data]) => ({ name, value: data.amount }))
            .sort((a, b) => b.value - a.value)
            .slice(0, 5);
    };

    if (loading) return <><Navbar /><div className="page"><div className="container">Loading...</div></div></>;

    const { income, expense, categoryStats } = calculateStats();
    const topCategories = Object.entries(categoryStats)
        .sort((a, b) => b[1].amount - a[1].amount)
        .slice(0, 5);

    const chartData = getChartData();
    const categoryChartData = getCategoryChartData();

    const COLORS = ['#4a7c59', '#6a9e78', '#c8902e', '#c0392b', '#5a6e8c'];

    return (
        <>
            <Navbar />
            <div className="page">
                <div className="container">
                    <div className="page-header">
                        <h1>Reports & Analytics</h1>
                        <select className="period-select" value={period} onChange={e => setPeriod(e.target.value)}>
                            <option value="week">This Week</option>
                            <option value="month">This Month</option>
                            <option value="year">This Year</option>
                        </select>
                    </div>

                    {aiInsights.length > 0 && (
                        <div className="ai-insights-section">
                            <div className="ai-insights-header">
                                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="18" height="18" className="ai-star">
                                    <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                                </svg>
                                <h3>Smart AI Insights</h3>
                            </div>
                            <div className="ai-insights-grid">
                                {aiInsights.map((insight, index) => (
                                    <div key={index} className="ai-insight-card">
                                        <div className="ai-insight-dot"></div>
                                        <p>{insight}</p>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    <div className="stats-grid">
                        <div className="stat-card">
                            <div className="stat-label">Total Income</div>
                            <div className="stat-value income">₹{income.toLocaleString()}</div>
                        </div>
                        <div className="stat-card">
                            <div className="stat-label">Total Expenses</div>
                            <div className="stat-value expense">₹{expense.toLocaleString()}</div>
                        </div>
                        <div className="stat-card">
                            <div className="stat-label">Net Savings</div>
                            <div className="stat-value">{income - expense >= 0 ? '+' : ''}₹{(income - expense).toLocaleString()}</div>
                        </div>
                        <div className="stat-card">
                            <div className="stat-label">Transactions</div>
                            <div className="stat-value">{transactions.length}</div>
                        </div>
                    </div>

                    <div className="charts-section">
                        <div className="chart-card">
                            <h3>Income vs Expense Trend</h3>
                            <ResponsiveContainer width="100%" height={300}>
                                <LineChart data={chartData}>
                                    <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                                    <XAxis dataKey="label" stroke="#6b7280" />
                                    <YAxis stroke="#6b7280" />
                                    <Tooltip
                                        contentStyle={{ background: '#fff', border: '1px solid #e5e7eb', borderRadius: '8px' }}
                                        formatter={(value) => `₹${value.toLocaleString()}`}
                                    />
                                    <Legend />
                                    <Line type="monotone" dataKey="income" stroke="#10b981" strokeWidth={2} name="Income" />
                                    <Line type="monotone" dataKey="expense" stroke="#ef4444" strokeWidth={2} name="Expense" />
                                </LineChart>
                            </ResponsiveContainer>
                        </div>

                        <div className="chart-card">
                            <h3>Top Expense Categories</h3>
                            <ResponsiveContainer width="100%" height={300}>
                                <PieChart>
                                    <Pie
                                        data={categoryChartData}
                                        cx="50%"
                                        cy="50%"
                                        labelLine={false}
                                        label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                                        outerRadius={100}
                                        fill="#8884d8"
                                        dataKey="value"
                                    >
                                        {categoryChartData.map((entry, index) => (
                                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                        ))}
                                    </Pie>
                                    <Tooltip formatter={(value) => `₹${value.toLocaleString()}`} />
                                </PieChart>
                            </ResponsiveContainer>
                        </div>
                    </div>

                    <div className="reports-grid">
                        <div className="report-card">
                            <h3>Top Categories</h3>
                            <div className="category-list">
                                {topCategories.map(([name, data]) => (
                                    <div key={name} className="category-row">
                                        <div className="category-info">
                                            <div className="category-name">{name}</div>
                                            <div className="category-count">{data.count} transactions</div>
                                        </div>
                                        <div className={`category-amount ${data.type.toLowerCase()}`}>
                                            ₹{data.amount.toLocaleString()}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        <div className="report-card">
                            <h3>Monthly Comparison</h3>
                            <ResponsiveContainer width="100%" height={250}>
                                <BarChart data={chartData}>
                                    <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                                    <XAxis dataKey="label" stroke="#6b7280" />
                                    <YAxis stroke="#6b7280" />
                                    <Tooltip
                                        contentStyle={{ background: '#fff', border: '1px solid #e5e7eb', borderRadius: '8px' }}
                                        formatter={(value) => `₹${value.toLocaleString()}`}
                                    />
                                    <Legend />
                                    <Bar dataKey="income" fill="#10b981" name="Income" />
                                    <Bar dataKey="expense" fill="#ef4444" name="Expense" />
                                </BarChart>
                            </ResponsiveContainer>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}

export default Reports;
