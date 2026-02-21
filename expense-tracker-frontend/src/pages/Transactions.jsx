import { useState, useEffect } from 'react';
import { transactionAPI, categoryAPI, walletAPI } from '../services/api';
import { toast } from 'react-toastify';
import Navbar from '../components/Navbar';
import './Transactions.css';

function Transactions() {
    const [transactions, setTransactions] = useState([]);
    const [categories, setCategories] = useState([]);
    const [wallets, setWallets] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [editMode, setEditMode] = useState(false);
    const [editId, setEditId] = useState(null);
    const [formData, setFormData] = useState({
        type: 'EXPENSE',
        amount: '',
        description: '',
        categoryId: '',
        walletId: '',
        transactionDate: new Date().toISOString().split('T')[0]
    });

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            const [txRes, catRes, walRes] = await Promise.all([
                transactionAPI.getRecent(50),
                categoryAPI.getAll(),
                walletAPI.getAll()
            ]);
            setTransactions(txRes.data);
            setCategories(catRes.data);
            setWallets(walRes.data);
        } catch (error) {
            toast.error('Failed to load data');
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const payload = {
                ...formData,
                amount: parseFloat(formData.amount),
                categoryId: parseInt(formData.categoryId),
                walletId: parseInt(formData.walletId)
            };

            if (editMode) {
                await transactionAPI.update(editId, payload);
                toast.success('Transaction updated!');
            } else {
                await transactionAPI.create(payload);
                toast.success('Transaction added!');
            }

            setShowModal(false);
            setEditMode(false);
            setEditId(null);
            fetchData();
            resetForm();
        } catch (error) {
            toast.error(editMode ? 'Failed to update transaction' : 'Failed to add transaction');
        }
    };

    const handleEdit = (transaction) => {
        setEditMode(true);
        setEditId(transaction.id);
        setFormData({
            type: transaction.type,
            amount: transaction.amount.toString(),
            description: transaction.description,
            categoryId: transaction.category?.id.toString() || '',
            walletId: transaction.wallet?.id.toString() || '',
            transactionDate: transaction.transactionDate
        });
        setShowModal(true);
    };

    const handleDelete = async (id) => {
        if (window.confirm('Delete this transaction?')) {
            try {
                await transactionAPI.delete(id);
                toast.success('Transaction deleted');
                fetchData();
            } catch (error) {
                toast.error('Failed to delete');
            }
        }
    };

    const resetForm = () => {
        setFormData({
            type: 'EXPENSE',
            amount: '',
            description: '',
            categoryId: '',
            walletId: '',
            transactionDate: new Date().toISOString().split('T')[0]
        });
    };

    const handleCloseModal = () => {
        setShowModal(false);
        setEditMode(false);
        setEditId(null);
        resetForm();
    };

    if (loading) return <><Navbar /><div className="page"><div className="container">Loading...</div></div></>;

    return (
        <>
            <Navbar />
            <div className="page">
                <div className="container">
                    <div className="page-header">
                        <h1>Transactions</h1>
                        <button className="btn btn-primary" onClick={() => setShowModal(true)}>
                            Add Transaction
                        </button>
                    </div>

                    <div className="transactions-list">
                        {transactions.length === 0 ? (
                            <div className="empty-state">No transactions yet</div>
                        ) : (
                            transactions.map(tx => (
                                <div key={tx.id} className="transaction-item">
                                    <div className="transaction-info">
                                        <div className="transaction-desc">{tx.description}</div>
                                        <div className="transaction-meta">
                                            {tx.category?.name} • {new Date(tx.transactionDate).toLocaleDateString()}
                                        </div>
                                    </div>
                                    <div className="transaction-right">
                                        <div className={`transaction-amount ${tx.type.toLowerCase()}`}>
                                            {tx.type === 'INCOME' ? '+' : '-'}₹{tx.amount.toLocaleString()}
                                        </div>
                                        <div className="transaction-actions">
                                            <button className="btn-icon" onClick={() => handleEdit(tx)} title="Edit">✏️</button>
                                            <button className="btn-icon" onClick={() => handleDelete(tx.id)} title="Delete">🗑️</button>
                                        </div>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                </div>
            </div>

            {showModal && (
                <div className="modal-overlay" onClick={handleCloseModal}>
                    <div className="modal" onClick={e => e.stopPropagation()}>
                        <h2>{editMode ? 'Edit Transaction' : 'Add Transaction'}</h2>
                        <form onSubmit={handleSubmit}>
                            <div className="form-group">
                                <label className="form-label">Type</label>
                                <select className="form-input" value={formData.type} onChange={e => setFormData({ ...formData, type: e.target.value })}>
                                    <option value="EXPENSE">Expense</option>
                                    <option value="INCOME">Income</option>
                                </select>
                            </div>

                            <div className="form-group">
                                <label className="form-label">Amount</label>
                                <input type="number" className="form-input" value={formData.amount} onChange={e => setFormData({ ...formData, amount: e.target.value })} required />
                            </div>

                            <div className="form-group">
                                <label className="form-label">Description</label>
                                <input type="text" className="form-input" value={formData.description} onChange={e => setFormData({ ...formData, description: e.target.value })} required />
                            </div>

                            <div className="form-group">
                                <label className="form-label">Category</label>
                                <select className="form-input" value={formData.categoryId} onChange={e => setFormData({ ...formData, categoryId: e.target.value })} required>
                                    <option value="">Select category</option>
                                    {categories.filter(c => c.type === formData.type).map(cat => (
                                        <option key={cat.id} value={cat.id}>{cat.name}</option>
                                    ))}
                                </select>
                            </div>

                            <div className="form-group">
                                <label className="form-label">Wallet</label>
                                <select className="form-input" value={formData.walletId} onChange={e => setFormData({ ...formData, walletId: e.target.value })} required>
                                    <option value="">Select wallet</option>
                                    {wallets.map(w => (
                                        <option key={w.id} value={w.id}>{w.name} (₹{w.balance})</option>
                                    ))}
                                </select>
                            </div>

                            <div className="form-group">
                                <label className="form-label">Date</label>
                                <input type="date" className="form-input" value={formData.transactionDate} onChange={e => setFormData({ ...formData, transactionDate: e.target.value })} required />
                            </div>

                            <div className="modal-actions">
                                <button type="button" className="btn btn-secondary" onClick={handleCloseModal}>Cancel</button>
                                <button type="submit" className="btn btn-primary">{editMode ? 'Update' : 'Add'}</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </>
    );
}

export default Transactions;
