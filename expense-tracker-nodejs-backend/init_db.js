const fs = require('fs');
const path = require('path');
const { exec } = require('./src/config/db');

async function init() {
    try {
        const schemaPath = path.join(__dirname, 'schema.sql');
        const schema = fs.readFileSync(schemaPath, 'utf8');

        // Split schema by CREATE TABLE to execute separately (SQLite exec can handle multiple but let's be safe)
        const statements = schema.split(';').filter(s => s.trim() !== '');

        for (const statement of statements) {
            await exec(statement);
        }

        console.log('Database initialized successfully');
        process.exit(0);
    } catch (error) {
        console.error('Failed to initialize database:', error);
        process.exit(1);
    }
}

init();
