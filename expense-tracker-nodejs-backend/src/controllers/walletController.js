const db = require('../config/db');

const getAllWallets = async (req, res) => {
    try {
        const userId = req.user.userId;
        const result = await db.query('SELECT * FROM wallets WHERE user_id = ?', [userId]);
        res.json(result.rows);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error fetching wallets' });
    }
};

const createWallet = async (req, res) => {
    try {
        const { name, type, balance } = req.body;
        const userId = req.user.userId;

        const result = await db.run(
            'INSERT INTO wallets (name, type, balance, user_id) VALUES (?, ?, ?, ?)',
            [name, type, balance || 0, userId]
        );

        const wallet = await db.query('SELECT * FROM wallets WHERE id = ?', [result.lastID]);
        res.status(201).json(wallet.rows[0]);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error creating wallet' });
    }
};

const updateWallet = async (req, res) => {
    try {
        const { id } = req.params;
        const { name, type, balance } = req.body;
        const userId = req.user.userId;

        const checkResult = await db.query('SELECT * FROM wallets WHERE id = ?', [id]);
        const wallet = checkResult.rows[0];

        if (!wallet) return res.status(404).json({ message: 'Wallet not found' });
        if (wallet.user_id !== userId) return res.status(401).json({ message: 'Unauthorized' });

        await db.run(
            'UPDATE wallets SET name = ?, type = ?, balance = ? WHERE id = ?',
            [name, type, balance, id]
        );

        const updatedWallet = await db.query('SELECT * FROM wallets WHERE id = ?', [id]);
        res.json(updatedWallet.rows[0]);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error updating wallet' });
    }
};

const deleteWallet = async (req, res) => {
    try {
        const { id } = req.params;
        const userId = req.user.userId;

        const checkResult = await db.query('SELECT * FROM wallets WHERE id = ?', [id]);
        const wallet = checkResult.rows[0];

        if (!wallet) return res.status(404).json({ message: 'Wallet not found' });
        if (wallet.user_id !== userId) return res.status(401).json({ message: 'Unauthorized' });

        await db.run('DELETE FROM wallets WHERE id = ?', [id]);
        res.json({ message: 'Wallet deleted' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error deleting wallet' });
    }
};

module.exports = { getAllWallets, createWallet, updateWallet, deleteWallet };
