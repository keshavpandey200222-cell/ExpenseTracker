const db = require('../config/db');

const getAllTransactions = async (req, res) => {
    try {
        const userId = req.user.userId;
        const { type, categoryId, walletId, startDate, endDate, limit } = req.query;

        let queryText = `
            SELECT t.*, c.name as category_name, w.name as wallet_name 
            FROM transactions t
            JOIN categories c ON t.category_id = c.id
            JOIN wallets w ON t.wallet_id = w.id
            WHERE t.user_id = ?
        `;
        const params = [userId];

        if (type) {
            queryText += ` AND t.type = ?`;
            params.push(type);
        }
        if (categoryId) {
            queryText += ` AND t.category_id = ?`;
            params.push(categoryId);
        }
        if (walletId) {
            queryText += ` AND t.wallet_id = ?`;
            params.push(walletId);
        }
        if (startDate && endDate) {
            queryText += ` AND t.transaction_date >= ? AND t.transaction_date <= ?`;
            params.push(startDate, endDate);
        }

        queryText += ' ORDER BY t.transaction_date DESC';

        if (limit) {
            queryText += ' LIMIT ?';
            params.push(parseInt(limit));
        }

        const result = await db.query(queryText, params);

        // Transform to structured objects for frontend
        const structuredTransactions = result.rows.map(tx => ({
            id: tx.id,
            amount: tx.amount,
            description: tx.description,
            type: tx.type,
            transactionDate: tx.transaction_date,
            billImageUrl: tx.bill_image_url,
            category: {
                id: tx.category_id,
                name: tx.category_name
            },
            wallet: {
                id: tx.wallet_id,
                name: tx.wallet_name
            }
        }));

        res.json(structuredTransactions);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error fetching transactions' });
    }
};

const createTransaction = async (req, res) => {
    try {
        const userId = req.user.userId;
        const { amount, description, type, categoryId, walletId, transactionDate, billImageUrl } = req.body;

        await db.exec('BEGIN TRANSACTION');

        const insertResult = await db.run(
            'INSERT INTO transactions (amount, description, type, category_id, wallet_id, transaction_date, bill_image_url, user_id) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
            [amount, description, type, categoryId, walletId, transactionDate, billImageUrl, userId]
        );
        const transactionId = insertResult.lastID;

        // Update wallet balance
        const balanceChange = type === 'INCOME' ? amount : -amount;
        await db.run(
            'UPDATE wallets SET balance = balance + ? WHERE id = ?',
            [balanceChange, walletId]
        );

        await db.exec('COMMIT');

        const result = await db.query(`
            SELECT t.*, c.name as category_name, w.name as wallet_name 
            FROM transactions t
            JOIN categories c ON t.category_id = c.id
            JOIN wallets w ON t.wallet_id = w.id
            WHERE t.id = ?
        `, [transactionId]);

        const tx = result.rows[0];
        res.status(201).json({
            id: tx.id,
            amount: tx.amount,
            description: tx.description,
            type: tx.type,
            transactionDate: tx.transaction_date,
            billImageUrl: tx.bill_image_url,
            category: { id: tx.category_id, name: tx.category_name },
            wallet: { id: tx.wallet_id, name: tx.wallet_name }
        });
    } catch (error) {
        await db.exec('ROLLBACK');
        console.error(error);
        res.status(500).json({ message: 'Error creating transaction' });
    }
};

const updateTransaction = async (req, res) => {
    try {
        const { id } = req.params;
        const userId = req.user.userId;
        const { amount, description, type, categoryId, walletId, transactionDate, billImageUrl } = req.body;

        const checkResult = await db.query('SELECT * FROM transactions WHERE id = ?', [id]);
        const oldTransaction = checkResult.rows[0];

        if (!oldTransaction) return res.status(404).json({ message: 'Transaction not found' });
        if (oldTransaction.user_id !== userId) return res.status(401).json({ message: 'Unauthorized' });

        await db.exec('BEGIN TRANSACTION');

        // Reverse old wallet balance change
        const oldBalanceChange = oldTransaction.type === 'INCOME' ? -oldTransaction.amount : oldTransaction.amount;
        await db.run(
            'UPDATE wallets SET balance = balance + ? WHERE id = ?',
            [oldBalanceChange, oldTransaction.wallet_id]
        );

        // Update transaction
        await db.run(
            'UPDATE transactions SET amount = ?, description = ?, type = ?, category_id = ?, wallet_id = ?, transaction_date = ?, bill_image_url = ? WHERE id = ?',
            [amount, description, type, categoryId, walletId, transactionDate, billImageUrl, id]
        );

        // Apply new wallet balance change
        const newBalanceChange = type === 'INCOME' ? amount : -amount;
        await db.run(
            'UPDATE wallets SET balance = balance + ? WHERE id = ?',
            [newBalanceChange, walletId]
        );

        await db.exec('COMMIT');

        const result = await db.query(`
            SELECT t.*, c.name as category_name, w.name as wallet_name 
            FROM transactions t
            JOIN categories c ON t.category_id = c.id
            JOIN wallets w ON t.wallet_id = w.id
            WHERE t.id = ?
        `, [id]);

        const tx = result.rows[0];
        res.json({
            id: tx.id,
            amount: tx.amount,
            description: tx.description,
            type: tx.type,
            transactionDate: tx.transaction_date,
            billImageUrl: tx.bill_image_url,
            category: { id: tx.category_id, name: tx.category_name },
            wallet: { id: tx.wallet_id, name: tx.wallet_name }
        });
    } catch (error) {
        await db.exec('ROLLBACK');
        console.error(error);
        res.status(500).json({ message: 'Error updating transaction' });
    }
};

const deleteTransaction = async (req, res) => {
    try {
        const { id } = req.params;
        const userId = req.user.userId;

        const checkResult = await db.query('SELECT * FROM transactions WHERE id = ?', [id]);
        const transaction = checkResult.rows[0];

        if (!transaction) return res.status(404).json({ message: 'Transaction not found' });
        if (transaction.user_id !== userId) return res.status(401).json({ message: 'Unauthorized' });

        await db.exec('BEGIN TRANSACTION');

        // Reverse wallet balance change
        const balanceChange = transaction.type === 'INCOME' ? -transaction.amount : transaction.amount;
        await db.run(
            'UPDATE wallets SET balance = balance + ? WHERE id = ?',
            [balanceChange, transaction.wallet_id]
        );

        await db.run('DELETE FROM transactions WHERE id = ?', [id]);

        await db.exec('COMMIT');
        res.json({ message: 'Transaction deleted' });
    } catch (error) {
        await db.exec('ROLLBACK');
        console.error(error);
        res.status(500).json({ message: 'Error deleting transaction' });
    }
};

module.exports = { getAllTransactions, createTransaction, updateTransaction, deleteTransaction };
