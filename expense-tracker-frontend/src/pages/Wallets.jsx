import { useState, useEffect } from 'react';
import { walletAPI } from '../services/api';
import { toast } from 'react-toastify';
import Navbar from '../components/Navbar';
import './Wallets.css';

function Wallets() {
    const [wallets, setWallets] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [formData, setFormData] = useState({
        name: '',
        type: 'BANK_ACCOUNT',
        balance: ''
    });

    useEffect(() => {
        fetchWallets();
    }, []);

    const fetchWallets = async () => {
        try {
            const response = await walletAPI.getAll();
            setWallets(response.data);
        } catch (error) {
            toast.error('Failed to load wallets');
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await walletAPI.create({
                ...formData,
                balance: parseFloat(formData.balance)
            });
            toast.success('Wallet created!');
            setShowModal(false);
            fetchWallets();
            setFormData({ name: '', type: 'BANK_ACCOUNT', balance: '' });
        } catch (error) {
            toast.error('Failed to create wallet');
        }
    };

    const handleDelete = async (id) => {
        if (window.confirm('Delete this wallet?')) {
            try {
                await walletAPI.delete(id);
                toast.success('Wallet deleted');
                fetchWallets();
            } catch (error) {
                toast.error('Failed to delete');
            }
        }
    };

    const getWalletIcon = (type) => {
        const icons = {
            BANK_ACCOUNT: '🏦',
            CASH: '💵',
            UPI: '📱',
            CREDIT_CARD: '💳'
        };
        return icons[type] || '💰';
    };

    if (loading) return <><Navbar /><div className="page"><div className="container">Loading...</div></div></>;

    const totalBalance = wallets.reduce((sum, w) => sum + w.balance, 0);

    return (
        <>
            <Navbar />
            <div className="page">
                <div className="container">
                    <div className="page-header">
                        <h1>Wallets</h1>
                        <button className="btn btn-primary" onClick={() => setShowModal(true)}>
                            Add Wallet
                        </button>
                    </div>

                    <div className="total-balance-card">
                        <div className="total-label">Total Balance</div>
                        <div className="total-amount">₹{totalBalance.toLocaleString()}</div>
                    </div>

                    <div className="wallets-grid">
                        {wallets.map(wallet => (
                            <div key={wallet.id} className="wallet-card">
                                <div className="wallet-icon">{getWalletIcon(wallet.type)}</div>
                                <div className="wallet-info">
                                    <div className="wallet-name">{wallet.name}</div>
                                    <div className="wallet-type">{wallet.type.replace('_', ' ')}</div>
                                </div>
                                <div className="wallet-balance">₹{wallet.balance.toLocaleString()}</div>
                                <button className="btn-icon" onClick={() => handleDelete(wallet.id)}>🗑️</button>
                            </div>
                        ))}
                    </div>

                    {wallets.length === 0 && (
                        <div className="empty-state">No wallets yet. Add one to get started!</div>
                    )}
                </div>
            </div>

            {showModal && (
                <div className="modal-overlay" onClick={() => setShowModal(false)}>
                    <div className="modal" onClick={e => e.stopPropagation()}>
                        <h2>Add Wallet</h2>
                        <form onSubmit={handleSubmit}>
                            <div className="form-group">
                                <label className="form-label">Name</label>
                                <input type="text" className="form-input" value={formData.name} onChange={e => setFormData({ ...formData, name: e.target.value })} placeholder="My Bank Account" required />
                            </div>

                            <div className="form-group">
                                <label className="form-label">Type</label>
                                <select className="form-input" value={formData.type} onChange={e => setFormData({ ...formData, type: e.target.value })}>
                                    <option value="BANK_ACCOUNT">Bank Account</option>
                                    <option value="CASH">Cash</option>
                                    <option value="UPI">UPI</option>
                                    <option value="CREDIT_CARD">Credit Card</option>
                                </select>
                            </div>

                            <div className="form-group">
                                <label className="form-label">Initial Balance</label>
                                <input type="number" className="form-input" value={formData.balance} onChange={e => setFormData({ ...formData, balance: e.target.value })} placeholder="10000" required />
                            </div>

                            <div className="modal-actions">
                                <button type="button" className="btn btn-secondary" onClick={() => setShowModal(false)}>Cancel</button>
                                <button type="submit" className="btn btn-primary">Create</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </>
    );
}

export default Wallets;
