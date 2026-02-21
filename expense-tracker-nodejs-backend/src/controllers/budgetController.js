const db = require('../config/db');

const getAllBudgets = async (req, res) => {
    try {
        const userId = req.user.userId;
        const result = await db.query(
            'SELECT b.*, c.name as category_name FROM budgets b JOIN categories c ON b.category_id = c.id WHERE b.user_id = ?',
            [userId]
        );
        res.json(result.rows);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error fetching budgets' });
    }
};

const createBudget = async (req, res) => {
    try {
        const userId = req.user.userId;
        const { amount, period, categoryId, startDate, endDate } = req.body;

        const result = await db.run(
            'INSERT INTO budgets (amount, period, category_id, startDate, endDate, user_id) VALUES (?, ?, ?, ?, ?, ?)',
            [amount, period, categoryId, startDate, endDate, userId]
        );

        const budget = await db.query('SELECT * FROM budgets WHERE id = ?', [result.lastID]);
        res.status(201).json(budget.rows[0]);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error creating budget' });
    }
};

const deleteBudget = async (req, res) => {
    try {
        const { id } = req.params;
        const userId = req.user.userId;

        const checkResult = await db.query('SELECT * FROM budgets WHERE id = ?', [id]);
        const budget = checkResult.rows[0];

        if (!budget) return res.status(404).json({ message: 'Budget not found' });
        if (budget.user_id !== userId) return res.status(401).json({ message: 'Unauthorized' });

        await db.run('DELETE FROM budgets WHERE id = ?', [id]);
        res.json({ message: 'Budget deleted' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error deleting budget' });
    }
};

const getBudgetStatus = async (req, res) => {
    try {
        const userId = req.user.userId;
        const budgetsResult = await db.query(
            'SELECT b.*, c.name as category_name FROM budgets b JOIN categories c ON b.category_id = c.id WHERE b.user_id = ?',
            [userId]
        );
        const budgets = budgetsResult.rows;

        const status = {};
        const now = new Date().toISOString().split('T')[0];

        for (const budget of budgets) {
            if (now >= budget.startDate && now <= budget.endDate) {
                const spentResult = await db.query(
                    "SELECT SUM(amount) as spent FROM transactions WHERE user_id = ? AND category_id = ? AND type = 'EXPENSE' AND transaction_date >= ? AND transaction_date <= ?",
                    [userId, budget.category_id, budget.startDate, budget.endDate]
                );
                const spent = parseFloat(spentResult.rows[0].spent || 0);

                status[budget.category_name] = {
                    budgetId: budget.id,
                    category: budget.category_name,
                    limit: parseFloat(budget.amount),
                    spent,
                    remaining: parseFloat(budget.amount) - spent,
                    percentage: (spent / parseFloat(budget.amount)) * 100
                };
            }
        }

        res.json(status);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error fetching budget status' });
    }
};

module.exports = { getAllBudgets, createBudget, deleteBudget, getBudgetStatus };
