import { useState, useEffect } from 'react';
import { categoryAPI } from '../services/api';
import { toast } from 'react-toastify';
import Navbar from '../components/Navbar';
import './Categories.css';

function Categories() {
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [formData, setFormData] = useState({
        name: '',
        type: 'EXPENSE'
    });

    useEffect(() => {
        const fetchCategories = async () => {
            try {
                const response = await categoryAPI.getAll();
                // Ensure we handle both { rows: [] } and [] depending on backend wrapper
                const data = response.data?.rows || response.data || [];
                setCategories(Array.isArray(data) ? data : []);
            } catch (error) {
                console.error("Categories fetch error:", error);
                toast.error('Failed to load categories');
                setCategories([]);
            } finally {
                setLoading(false);
            }
        };

        fetchCategories();
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await categoryAPI.create(formData);
            toast.success('Category created!');
            setShowModal(false);
            setFormData({ name: '', type: 'EXPENSE' });

            // Re-fetch
            const response = await categoryAPI.getAll();
            const data = response.data?.rows || response.data || [];
            setCategories(Array.isArray(data) ? data : []);
        } catch (error) {
            toast.error('Failed to create category');
        }
    };

    const handleDelete = async (id, isDefault) => {
        if (isDefault) {
            toast.error('Cannot delete default categories');
            return;
        }
        if (window.confirm('Delete this category?')) {
            try {
                await categoryAPI.delete(id);
                toast.success('Category deleted');
                const response = await categoryAPI.getAll();
                const data = response.data?.rows || response.data || [];
                setCategories(Array.isArray(data) ? data : []);
            } catch (error) {
                toast.error('Failed to delete');
            }
        }
    };

    if (loading) return (
        <>
            <Navbar />
            <div className="page">
                <div className="container loading-state">
                    <div className="loading-spinner"></div>
                    <p>Loading your categories...</p>
                </div>
            </div>
        </>
    );

    const safeCategories = Array.isArray(categories) ? categories : [];
    const expenseCategories = safeCategories.filter(c => c.type === 'EXPENSE');
    const incomeCategories = safeCategories.filter(c => c.type === 'INCOME');

    return (
        <>
            <Navbar />
            <div className="page">
                <div className="container">
                    <div className="page-header">
                        <div className="serif h1">Categories</div>
                        <button className="btn btn-primary" onClick={() => setShowModal(true)}>
                            Add Category +
                        </button>
                    </div>

                    <div className="categories-section">
                        <h3 className="section-title">Expense Categories</h3>
                        <div className="categories-grid">
                            {expenseCategories.length === 0 ? (
                                <div className="empty-state">No expense categories found.</div>
                            ) : (
                                expenseCategories.map(cat => (
                                    <div key={cat.id || Math.random()} className="category-card">
                                        <div className="category-name">{cat.name}</div>
                                        <div className="category-actions">
                                            <span className="category-type expense">Expense</span>
                                            {cat.is_default ? (
                                                <span className="badge badge-income" style={{ background: 'var(--bg-secondary)', color: 'var(--text-muted)' }}>Default</span>
                                            ) : (
                                                <button className="btn-icon" onClick={() => handleDelete(cat.id, cat.is_default)} title="Delete">🗑️</button>
                                            )}
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>
                    </div>

                    <div className="categories-section mt-3">
                        <h3 className="section-title">Income Categories</h3>
                        <div className="categories-grid">
                            {incomeCategories.length === 0 ? (
                                <div className="empty-state">No income categories found.</div>
                            ) : (
                                incomeCategories.map(cat => (
                                    <div key={cat.id || Math.random()} className="category-card">
                                        <div className="category-name">{cat.name}</div>
                                        <div className="category-actions">
                                            <span className="category-type income">Income</span>
                                            {cat.is_default ? (
                                                <span className="badge badge-income" style={{ background: 'var(--bg-secondary)', color: 'var(--text-muted)' }}>Default</span>
                                            ) : (
                                                <button className="btn-icon" onClick={() => handleDelete(cat.id, cat.is_default)} title="Delete">🗑️</button>
                                            )}
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>
                    </div>
                </div>
            </div>

            {showModal && (
                <div className="modal-overlay" onClick={() => setShowModal(false)}>
                    <div className="modal" onClick={e => e.stopPropagation()}>
                        <h2>Add Category</h2>
                        <form onSubmit={handleSubmit}>
                            <div className="form-group">
                                <label className="form-label">Name</label>
                                <input
                                    type="text"
                                    className="form-input"
                                    value={formData.name}
                                    onChange={e => setFormData({ ...formData, name: e.target.value })}
                                    placeholder="e.g. Shopping, Rent"
                                    required
                                />
                            </div>

                            <div className="form-group">
                                <label className="form-label">Type</label>
                                <select
                                    className="form-input"
                                    value={formData.type}
                                    onChange={e => setFormData({ ...formData, type: e.target.value })}
                                >
                                    <option value="EXPENSE">Expense</option>
                                    <option value="INCOME">Income</option>
                                </select>
                            </div>

                            <div className="modal-actions">
                                <button type="button" className="btn btn-secondary" onClick={() => setShowModal(false)}>Cancel</button>
                                <button type="submit" className="btn btn-primary">Create Category</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </>
    );
}

export default Categories;
