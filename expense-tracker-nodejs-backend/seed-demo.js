const bcrypt = require('bcryptjs');
const db = require('./src/config/db');

async function seed() {
    console.log('🌱 Seeding robust demo account...');

    try {
        // 1. Create Demo User
        const demoEmail = 'demo@example.com';
        const demoPassword = 'demo123';
        const hashedPassword = await bcrypt.hash(demoPassword, 10);

        // Remove existing demo user if any (to reset)
        const existing = await db.query('SELECT id FROM users WHERE email = ?', [demoEmail]);
        if (existing.rows.length > 0) {
            console.log('🚮 Removing existing demo user...');
            await db.run('DELETE FROM users WHERE id = ?', [existing.rows[0].id]);
        }

        const userResult = await db.run(
            'INSERT INTO users (name, email, password) VALUES (?, ?, ?)',
            ['Demo User', demoEmail, hashedPassword]
        );
        const userId = userResult.lastID;
        console.log(`✅ Demo user created (ID: ${userId})`);

        // 2. Create Categories
        const categories = [
            { name: 'Salary', type: 'INCOME' },
            { name: 'Freelance', type: 'INCOME' },
            { name: 'Investments', type: 'INCOME' },
            { name: 'Food & Dining', type: 'EXPENSE' },
            { name: 'Shopping', type: 'EXPENSE' },
            { name: 'Transportation', type: 'EXPENSE' },
            { name: 'Bills & Utilities', type: 'EXPENSE' },
            { name: 'Entertainment', type: 'EXPENSE' },
            { name: 'Rent & Home', type: 'EXPENSE' },
            { name: 'Health', type: 'EXPENSE' },
            { name: 'Education', type: 'EXPENSE' },
            { name: 'Travel', type: 'EXPENSE' }
        ];

        const categoryMap = {};
        for (const cat of categories) {
            const res = await db.run(
                'INSERT INTO categories (name, type, user_id, is_default) VALUES (?, ?, ?, 1)',
                [cat.name, cat.type, userId]
            );
            categoryMap[cat.name] = res.lastID;
        }
        console.log('✅ Categories created');

        // 3. Create Wallets
        const wallets = [
            { name: 'HDFC Bank', type: 'BANK_ACCOUNT', balance: 125000 },
            { name: 'Cash', type: 'CASH', balance: 12000 },
            { name: 'Paytm Wallet', type: 'UPI', balance: 8500 },
            { name: 'ICICI Credit Card', type: 'CREDIT_CARD', balance: -15400 }
        ];

        const walletMap = {};
        for (const wall of wallets) {
            const res = await db.run(
                'INSERT INTO wallets (name, type, balance, user_id) VALUES (?, ?, ?, ?)',
                [wall.name, wall.type, wall.balance, userId]
            );
            walletMap[wall.name] = res.lastID;
        }
        console.log('✅ Wallets created');

        // 4. Create Transactions (Multi-month)
        const today = new Date();
        const dates = [];
        for (let i = 0; i < 60; i++) {
            const d = new Date();
            d.setDate(today.getDate() - i);
            dates.push(d.toISOString().split('T')[0]);
        }

        // Generate dynamic transactions for every single day
        const transactionPromises = [];
        const expCats = categories.filter(c => c.type === 'EXPENSE');
        const incCats = categories.filter(c => c.type === 'INCOME');
        const wallNames = Object.keys(walletMap);

        dates.forEach((date, index) => {
            // Regular daily expenses
            const numTxs = 2 + Math.floor(Math.random() * 3); // 2-4 transactions per day
            for (let i = 0; i < numTxs; i++) {
                const cat = expCats[Math.floor(Math.random() * expCats.length)];
                const wallet = wallNames[Math.floor(Math.random() * wallNames.length)];
                const amount = 100 + Math.floor(Math.random() * 1500);

                transactionPromises.push(db.run(
                    'INSERT INTO transactions (description, amount, type, category_id, wallet_id, user_id, transaction_date) VALUES (?, ?, ?, ?, ?, ?, ?)',
                    [`Daily ${cat.name}`, amount, 'EXPENSE', categoryMap[cat.name], walletMap[wallet], userId, date]
                ));
            }

            // Salary and larger income items
            if (index === 0 || index === 30) {
                transactionPromises.push(db.run(
                    'INSERT INTO transactions (description, amount, type, category_id, wallet_id, user_id, transaction_date) VALUES (?, ?, ?, ?, ?, ?, ?)',
                    ['Monthly Salary', 85000, 'INCOME', categoryMap['Salary'], walletMap['HDFC Bank'], userId, date]
                ));
            }

            // Occasional freelance income
            if (index % 15 === 0 && index !== 0) {
                transactionPromises.push(db.run(
                    'INSERT INTO transactions (description, amount, type, category_id, wallet_id, user_id, transaction_date) VALUES (?, ?, ?, ?, ?, ?, ?)',
                    ['Freelance Payment', 15000, 'INCOME', categoryMap['Freelance'], walletMap['Paytm Wallet'], userId, date]
                ));
            }
        });

        await Promise.all(transactionPromises);
        console.log(`✅ Generated ~${transactionPromises.length} transactions across 60 days`);

        // 5. Create Budgets
        const startOfMonth = new Date(today.getFullYear(), today.getMonth(), 1).toISOString().split('T')[0];
        const endOfMonth = new Date(today.getFullYear(), today.getMonth() + 1, 0).toISOString().split('T')[0];

        const budgets = [
            { cat: 'Food & Dining', amount: 15000 },
            { cat: 'Shopping', amount: 10000 },
            { cat: 'Transportation', amount: 5000 },
            { cat: 'Entertainment', amount: 5000 }
        ];

        for (const b of budgets) {
            await db.run(
                'INSERT INTO budgets (amount, category_id, user_id, startDate, endDate, period) VALUES (?, ?, ?, ?, ?, ?)',
                [b.amount, categoryMap[b.cat], userId, startOfMonth, endOfMonth, 'MONTHLY']
            );
        }
        console.log('✅ Budgets created');

        console.log('✨ Seeding complete! Login with: demo@example.com / demo123');
        process.exit(0);
    } catch (err) {
        console.error('❌ Error seeding:', err);
        process.exit(1);
    }
}

seed();
