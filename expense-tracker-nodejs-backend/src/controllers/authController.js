const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const db = require('../config/db');

const register = async (req, res) => {
    try {
        const { name, email, password } = req.body;

        // Check if user exists
        const userExists = await db.query('SELECT * FROM users WHERE email = ?', [email]);
        if (userExists.rows.length > 0) {
            return res.status(400).json({ message: 'Email already registered' });
        }

        // Hash password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Create user
        const result = await db.run(
            'INSERT INTO users (name, email, password) VALUES (?, ?, ?)',
            [name, email, hashedPassword]
        );
        const userId = result.lastID;

        // Create default categories for new user
        await createDefaultCategories(userId);

        // Generate token
        const token = jwt.sign(
            { userId, email },
            process.env.JWT_SECRET,
            { expiresIn: '24h' }
        );

        res.status(201).json({
            token,
            email,
            name
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error during registration' });
    }
};

const login = async (req, res) => {
    try {
        const { email, password } = req.body;

        const result = await db.query('SELECT * FROM users WHERE email = ?', [email]);
        const user = result.rows[0];

        if (!user) {
            return res.status(400).json({ message: 'Invalid credentials' });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ message: 'Invalid credentials' });
        }

        const token = jwt.sign(
            { userId: user.id, email: user.email },
            process.env.JWT_SECRET,
            { expiresIn: '24h' }
        );

        res.json({
            token,
            email: user.email,
            name: user.name
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error during login' });
    }
};

const createDefaultCategories = async (userId) => {
    const defaultExpenses = [
        ["Food & Dining", "EXPENSE", true, userId],
        ["Shopping", "EXPENSE", true, userId],
        ["Transportation", "EXPENSE", true, userId],
        ["Bills & Utilities", "EXPENSE", true, userId],
        ["Entertainment", "EXPENSE", true, userId],
        ["Healthcare", "EXPENSE", true, userId],
        ["Education", "EXPENSE", true, userId],
        ["Travel", "EXPENSE", true, userId],
        ["Other", "EXPENSE", true, userId]
    ];

    const defaultIncome = [
        ["Salary", "INCOME", true, userId],
        ["Business", "INCOME", true, userId],
        ["Investments", "INCOME", true, userId],
        ["Freelance", "INCOME", true, userId],
        ["Gifts", "INCOME", true, userId],
        ["Other", "INCOME", true, userId]
    ];

    const allDefaults = [...defaultExpenses, ...defaultIncome];

    for (const [name, type, is_default, u_id] of allDefaults) {
        await db.run(
            'INSERT INTO categories (name, type, is_default, user_id) VALUES (?, ?, ?, ?)',
            [name, type, is_default, u_id]
        );
    }
};

const getDemoStats = async (req, res) => {
    try {
        const demoEmail = 'demo@example.com';
        const userResult = await db.query('SELECT id FROM users WHERE email = ?', [demoEmail]);
        const user = userResult.rows[0];

        if (!user) {
            return res.status(404).json({ message: 'Demo account not found' });
        }

        const userId = user.id;

        // Total income and expenses
        const allResult = await db.query(
            'SELECT type, SUM(amount) as total FROM transactions WHERE user_id = ? GROUP BY type',
            [userId]
        );

        let totalIncome = 0;
        let totalExpenses = 0;

        allResult.rows.forEach(row => {
            if (row.type === 'INCOME') totalIncome = parseFloat(row.total || 0);
            else totalExpenses = parseFloat(row.total || 0);
        });

        // Get 5 recent transactions
        const recentResult = await db.query(
            `SELECT t.description, t.amount, t.type, c.name as category 
             FROM transactions t 
             JOIN categories c ON t.category_id = c.id 
             WHERE t.user_id = ? 
             ORDER BY t.transaction_date DESC 
             LIMIT 5`,
            [userId]
        );

        const totalBalance = totalIncome - totalExpenses;

        res.json({
            totalBalance,
            totalIncome,
            totalExpenses,
            recentTransactions: recentResult.rows
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error fetching demo stats' });
    }
};

module.exports = { register, login, getDemoStats };
