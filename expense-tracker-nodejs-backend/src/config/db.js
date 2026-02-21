const sqlite3 = require('sqlite3').verbose();
const { Pool } = require('pg');
const path = require('path');

let db;
let isPostgres = false;

if (process.env.DATABASE_URL) {
    // Production: PostgreSQL (Render/Supabase)
    db = new Pool({
        connectionString: process.env.DATABASE_URL,
        ssl: {
            rejectUnauthorized: false // Required for some cloud providers like Render/Supabase
        }
    });
    isPostgres = true;
    console.log('Using PostgreSQL database');
} else {
    // Development: SQLite
    const dbPath = path.resolve(__dirname, '../../database.sqlite');
    db = new sqlite3.Database(dbPath);
    console.log('Using SQLite database');
}

const query = (sql, params = []) => {
    return new Promise((resolve, reject) => {
        if (isPostgres) {
            // Convert '?' to '$1, $2, ...' for PostgreSQL
            let pgSql = sql;
            params.forEach((_, i) => {
                pgSql = pgSql.replace('?', `$${i + 1}`);
            });

            db.query(pgSql, params, (err, res) => {
                if (err) reject(err);
                else resolve({ rows: res.rows });
            });
        } else {
            db.all(sql, params, (err, rows) => {
                if (err) reject(err);
                else resolve({ rows });
            });
        }
    });
};

const run = (sql, params = []) => {
    return new Promise((resolve, reject) => {
        if (isPostgres) {
            // Convert '?' to '$1, $2, ...' for PostgreSQL
            let pgSql = sql;
            params.forEach((_, i) => {
                pgSql = pgSql.replace('?', `$${i + 1}`);
            });

            db.query(pgSql, params, (err, res) => {
                if (err) reject(err);
                else resolve({
                    lastID: res.rows?.[0]?.id || null,
                    changes: res.rowCount
                });
            });
        } else {
            db.run(sql, params, function (err) {
                if (err) reject(err);
                else resolve({ lastID: this.lastID, changes: this.changes });
            });
        }
    });
};

const exec = (sql) => {
    return new Promise((resolve, reject) => {
        if (isPostgres) {
            db.query(sql, (err) => {
                if (err) reject(err);
                else resolve();
            });
        } else {
            db.exec(sql, (err) => {
                if (err) reject(err);
                else resolve();
            });
        }
    });
};

module.exports = {
    query,
    run,
    exec,
    db,
    isPostgres
};
