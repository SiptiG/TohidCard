require('dotenv').config();

const sql = require('mssql');

console.log('DB_SERVER:', process.env.DB_SERVER);
console.log('DB_PORT:', process.env.DB_PORT);

const config = {
    user: process.env.DB_USER || 'sa',
    password: process.env.DB_PASSWORD || 'Tohid-Card@100btc',
    server: process.env.DB_SERVER || '141.98.210.182',
    port: parseInt(process.env.DB_PORT, 10) || 14333,
    database: process.env.DB_NAME || 'TCardDB',
    options: {
        encrypt: false,
        trustServerCertificate: true,
        connectTimeout: 30000,
    }
};

console.log('Database configuration:', config);
console.log('Port type:', typeof config.port);

const poolPromise = new sql.ConnectionPool(config)
    .connect()
    .then(pool => {
        console.log('✅ MSSQL connected (singleton)');
        return pool;
    })
    .catch(err => {
        console.error('❌ MSSQL connection error:', err);
        console.error('Error details:', err.message);
        throw err;
    });

async function getUserByUsername(username) {
    try {
        const pool = await poolPromise;
        const res = await pool.request()
            .input('Username', sql.NVarChar, username)
            .query('SELECT * FROM Users WHERE Username = @Username');
        return res.recordset[0];
    } catch (err) {
        console.error('❌ Error fetching user by username:', err);
        throw err;
    }
}

module.exports = { sql, poolPromise, getUserByUsername };