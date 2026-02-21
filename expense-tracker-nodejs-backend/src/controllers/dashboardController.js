const db = require('../config/db');

const getDashboardSummary = async (req, res) => {
    try {
        const userId = req.user.userId;
        const now = new Date();
        const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1).toISOString().split('T')[0];
        const endOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0).toISOString().split('T')[0];

        const lastMonthStart = new Date(now.getFullYear(), now.getMonth() - 1, 1).toISOString().split('T')[0];
        const lastMonthEnd = new Date(now.getFullYear(), now.getMonth(), 0).toISOString().split('T')[0];

        // 1. Core Totals
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

        const totalBalance = totalIncome - totalExpenses;

        // 2. Monthly Stats
        const monthlyResult = await db.query(
            'SELECT type, SUM(amount) as total FROM transactions WHERE user_id = ? AND transaction_date >= ? AND transaction_date <= ? GROUP BY type',
            [userId, startOfMonth, endOfMonth]
        );

        let monthlyIncome = 0;
        let monthlyExpenses = 0;
        monthlyResult.rows.forEach(row => {
            if (row.type === 'INCOME') monthlyIncome = parseFloat(row.total || 0);
            else monthlyExpenses = parseFloat(row.total || 0);
        });

        // 3. Last Month Stats (for comparison)
        const lastMonthResult = await db.query(
            'SELECT type, SUM(amount) as total FROM transactions WHERE user_id = ? AND transaction_date >= ? AND transaction_date <= ? GROUP BY type',
            [userId, lastMonthStart, lastMonthEnd]
        );

        let lastMonthExpenses = 0;
        lastMonthResult.rows.forEach(row => {
            if (row.type === 'EXPENSE') lastMonthExpenses = parseFloat(row.total || 0);
        });

        // 4. Budget Adherence
        const budgets = await db.query('SELECT * FROM budgets WHERE user_id = ?', [userId]);
        let budgetsMet = 0;
        let totalBudgets = budgets.rows.length;

        for (const budget of budgets.rows) {
            const spentRes = await db.query(
                "SELECT SUM(amount) as spent FROM transactions WHERE user_id = ? AND category_id = ? AND type = 'EXPENSE' AND transaction_date >= ? AND transaction_date <= ?",
                [userId, budget.category_id, startOfMonth, endOfMonth]
            );
            const spent = parseFloat(spentRes.rows[0].spent || 0);
            if (spent <= parseFloat(budget.amount)) budgetsMet++;
        }

        // 5. Heuristic AI Engine
        let healthScore = 0;
        const insights = [];
        let personality = 'Balanced Spender';

        // Savings Rate Calculation
        const savingsRate = monthlyIncome > 0 ? (monthlyIncome - monthlyExpenses) / monthlyIncome : 0;

        // a) Savings Rate Score (50 pts)
        if (savingsRate >= 0.3) healthScore += 50;
        else if (savingsRate > 0) healthScore += (savingsRate / 0.3) * 50;

        // b) Budget Adherence Score (30 pts)
        if (totalBudgets > 0) healthScore += (budgetsMet / totalBudgets) * 30;
        else healthScore += 20; // Default points for tracking

        // c) Monthly Progress Score (20 pts)
        if (monthlyExpenses < lastMonthExpenses && lastMonthExpenses > 0) healthScore += 20;
        else if (lastMonthExpenses > 0) healthScore += Math.max(0, 20 - ((monthlyExpenses / lastMonthExpenses) * 10));
        else healthScore += 15; // Default points for consistent tracking

        // Personality Determination
        if (savingsRate > 0.4) personality = 'Disciplined Saver';
        else if (totalBudgets > 0 && budgetsMet === totalBudgets) personality = 'Strategic Planner';
        else if (monthlyExpenses > monthlyIncome * 0.9) personality = 'Impulsive Spender';

        // Generate Insights
        if (savingsRate > 0.3) insights.push("You saved 30%+ of your income this month. Great job!");
        if (monthlyExpenses > lastMonthExpenses && lastMonthExpenses > 0) {
            const pct = Math.round(((monthlyExpenses / lastMonthExpenses) - 1) * 100);
            insights.push(`Spending is up ${pct}% compared to last month.`);
        }
        if (totalBudgets > 0 && budgetsMet < totalBudgets) {
            insights.push(`You have exceeded ${totalBudgets - budgetsMet} of your budgets.`);
        }
        if (monthlyExpenses < lastMonthExpenses && lastMonthExpenses > 0) {
            insights.push("You are spending less than last month. Keep it up!");
        }

        res.json({
            totalBalance,
            totalIncome,
            totalExpenses,
            monthlyIncome,
            monthlyExpenses,
            remainingBudget: monthlyIncome - monthlyExpenses,
            ai: {
                healthScore: Math.round(healthScore),
                personality,
                insights,
                savingsRate: Math.round(savingsRate * 100)
            }
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error fetching dashboard summary' });
    }
};

module.exports = { getDashboardSummary };
