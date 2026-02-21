import { useState, useEffect } from 'react';
import { budgetAPI, categoryAPI } from '../services/api';
import { toast } from 'react-toastify';
import Navbar from '../components/Navbar';
import './Budgets.css';

function Budgets() {
    const [budgets, setBudgets] = useState([]);
    const [budgetStatus, setBudgetStatus] = useState({});
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [formData, setFormData] = useState({
        categoryId: '',
        amount: '',
        period: 'MONTHLY',
        startDate: new Date().toISOString().split('T')[0],
        endDate: new Date(new Date().setMonth(new Date().getMonth() + 1)).toISOString().split('T')[0]
    });

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            const [budgetsRes, statusRes, categoriesRes] = await Promise.all([
                budgetAPI.getAll(),
                budgetAPI.getStatus(),
                categoryAPI.getAll()
            ]);
            setBudgets(budgetsRes.data);
            setBudgetStatus(statusRes.data);
            setCategories(categoriesRes.data.filter(c => c.type === 'EXPENSE'));
        } catch (error) {
            toast.error('Failed to load budgets');
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await budgetAPI.create({
                category: { id: parseInt(formData.categoryId) },
                amount: parseFloat(formData.amount),
                period: formData.period,
                startDate: formData.startDate,
                endDate: formData.endDate
            });
            toast.success('Budget created!');
            setShowModal(false);
            fetchData();
            setFormData({
                categoryId: '',
                amount: '',
                period: 'MONTHLY',
                startDate: new Date().toISOString().split('T')[0],
                endDate: new Date(new Date().setMonth(new Date().getMonth() + 1)).toISOString().split('T')[0]
            });
        } catch (error) {
            toast.error('Failed to create budget');
        }
    };

    const handleDelete = async (id) => {
        if (window.confirm('Delete this budget?')) {
            try {
                await budgetAPI.delete(id);
                toast.success('Budget deleted');
                fetchData();
            } catch (error) {
                toast.error('Failed to delete');
            }
        }
    };

    const getProgressColor = (percentage) => {
        if (percentage >= 90) return '#ef4444';
        if (percentage >= 70) return '#f59e0b';
        return '#10b981';
    };

    if (loading) return <><Navbar /><div className="page"><div className="container">Loading...</div></div></>;

    return (
        <>
            <Navbar />
            <div className="page">
                <div className="container">
                    <div className="page-header">
                        <h1>Budgets</h1>
                        <button className="btn btn-primary" onClick={() => setShowModal(true)}>Set Budget</button>
                    </div>

                    {Object.keys(budgetStatus).length > 0 ? (
                        <div className="budgets-grid">
                            {Object.entries(budgetStatus).map(([category, data]) => {
                                const percentage = data.percentage;
                                const isOverBudget = percentage > 100;

                                return (
                                    <div key={data.budgetId} className="budget-card">
                                        <div className="budget-header">
                                            <h3>{category}</h3>
                                            <button className="btn-icon" onClick={() => handleDelete(data.budgetId)}>🗑️</button>
                                        </div>

                                        <div className="budget-amounts">
                                            <div className="budget-spent">
                                                <span className="label">Spent</span>
                                                <span className="amount">₹{data.spent.toLocaleString()}</span>
                                            </div>
                                            <div className="budget-limit">
                                                <span className="label">Limit</span>
                                                <span className="amount">₹{data.limit.toLocaleString()}</span>
                                            </div>
                                        </div>

                                        <div className="progress-bar">
                                            <div
                                                className="progress-fill"
                                                style={{
                                                    width: `${Math.min(percentage, 100)}%`,
                                                    backgroundColor: getProgressColor(percentage)
                                                }}
                                            ></div>
                                        </div>

                                        <div className="budget-footer">
                                            <span className={`percentage ${isOverBudget ? 'over-budget' : ''}`}>
                                                {percentage.toFixed(1)}% used
                                            </span>
                                            <span className={`remaining ${isOverBudget ? 'over-budget' : ''}`}>
                                                {isOverBudget ? 'Over budget!' : `₹${data.remaining.toLocaleString()} left`}
                                            </span>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    ) : (
                        <div className="empty-state">
                            <div className="empty-icon">📊</div>
                            <h3>No Active Budgets</h3>
                            <p>Set monthly budgets for different categories to track your spending limits.</p>
                            <button className="btn btn-primary" onClick={() => setShowModal(true)}>
                                Create Your First Budget
                            </button>
                        </div>
                    )}
                </div>
            </div>

            {showModal && (
                <div className="modal-overlay" onClick={() => setShowModal(false)}>
                    <div className="modal" onClick={e => e.stopPropagation()}>
                        <h2>Set Budget</h2>
                        <form onSubmit={handleSubmit}>
                            <div className="form-group">
                                <label className="form-label">Category</label>
                                <select className="form-input" value={formData.categoryId} onChange={e => setFormData({ ...formData, categoryId: e.target.value })} required>
                                    <option value="">Select category</option>
                                    {categories.map(cat => (
                                        <option key={cat.id} value={cat.id}>{cat.name}</option>
                                    ))}
                                </select>
                            </div>

                            <div className="form-group">
                                <label className="form-label">Budget Amount</label>
                                <input type="number" className="form-input" value={formData.amount} onChange={e => setFormData({ ...formData, amount: e.target.value })} placeholder="10000" required />
                            </div>

                            <div className="form-group">
                                <label className="form-label">Period</label>
                                <select className="form-input" value={formData.period} onChange={e => setFormData({ ...formData, period: e.target.value })}>
                                    <option value="MONTHLY">Monthly</option>
                                    <option value="WEEKLY">Weekly</option>
                                    <option value="YEARLY">Yearly</option>
                                </select>
                            </div>

                            <div className="form-row">
                                <div className="form-group">
                                    <label className="form-label">Start Date</label>
                                    <input type="date" className="form-input" value={formData.startDate} onChange={e => setFormData({ ...formData, startDate: e.target.value })} required />
                                </div>

                                <div className="form-group">
                                    <label className="form-label">End Date</label>
                                    <input type="date" className="form-input" value={formData.endDate} onChange={e => setFormData({ ...formData, endDate: e.target.value })} required />
                                </div>
                            </div>

                            <div className="modal-actions">
                                <button type="button" className="btn btn-secondary" onClick={() => setShowModal(false)}>Cancel</button>
                                <button type="submit" className="btn btn-primary">Create Budget</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </>
    );
}

export default Budgets;
