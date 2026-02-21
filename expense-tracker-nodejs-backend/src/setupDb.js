const { query, exec, isPostgres } = require('./config/db');

const setupDatabase = async () => {
    console.log(`Setting up database (Postgres: ${isPostgres})...`);

    const tables = [
        `CREATE TABLE IF NOT EXISTS users (
            id ${isPostgres ? 'SERIAL' : 'INTEGER'} PRIMARY KEY ${isPostgres ? '' : 'AUTOINCREMENT'},
            name VARCHAR(100) NOT NULL,
            email VARCHAR(100) UNIQUE NOT NULL,
            password VARCHAR(255) NOT NULL,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )`,
        `CREATE TABLE IF NOT EXISTS wallets (
            id ${isPostgres ? 'SERIAL' : 'INTEGER'} PRIMARY KEY ${isPostgres ? '' : 'AUTOINCREMENT'},
            user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
            name VARCHAR(50) NOT NULL,
            type VARCHAR(20) NOT NULL,
            balance DECIMAL(15, 2) DEFAULT 0,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )`,
        `CREATE TABLE IF NOT EXISTS categories (
            id ${isPostgres ? 'SERIAL' : 'INTEGER'} PRIMARY KEY ${isPostgres ? '' : 'AUTOINCREMENT'},
            name VARCHAR(50) NOT NULL,
            type VARCHAR(10) NOT NULL CHECK (type IN ('INCOME', 'EXPENSE')),
            is_default BOOLEAN DEFAULT ${isPostgres ? 'FALSE' : '0'},
            user_id INTEGER REFERENCES users(id) ON DELETE SET NULL
        )`,
        `CREATE TABLE IF NOT EXISTS transactions (
            id ${isPostgres ? 'SERIAL' : 'INTEGER'} PRIMARY KEY ${isPostgres ? '' : 'AUTOINCREMENT'},
            user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
            wallet_id INTEGER NOT NULL REFERENCES wallets(id) ON DELETE CASCADE,
            category_id INTEGER NOT NULL REFERENCES categories(id) ON DELETE CASCADE,
            type VARCHAR(10) NOT NULL CHECK (type IN ('INCOME', 'EXPENSE')),
            amount DECIMAL(15, 2) NOT NULL,
            description VARCHAR(255),
            transaction_date DATE NOT NULL,
            bill_image_url VARCHAR(500),
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )`,
        `CREATE TABLE IF NOT EXISTS budgets (
            id ${isPostgres ? 'SERIAL' : 'INTEGER'} PRIMARY KEY ${isPostgres ? '' : 'AUTOINCREMENT'},
            user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
            category_id INTEGER NOT NULL REFERENCES categories(id) ON DELETE CASCADE,
            amount DECIMAL(15, 2) NOT NULL,
            period VARCHAR(20) DEFAULT 'MONTHLY',
            "startDate" DATE NOT NULL,
            "endDate" DATE NOT NULL
        )`
    ];

    try {
        for (const tableSql of tables) {
            await exec(tableSql);
        }
        console.log('Database tables verified/created successfully.');
    } catch (err) {
        console.error('Error setting up database:', err);
        process.exit(1);
    }
};

if (require.main === module) {
    setupDatabase();
}

module.exports = setupDatabase;
