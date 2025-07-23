require('dotenv').config();  // Ensure environment variables are loaded

const sql = require('mssql');

// Log environment variables to ensure they are loaded correctly
console.log('DB_SERVER:', process.env.DB_SERVER);
console.log('DB_PORT:', process.env.DB_PORT);

// Database connection configuration using environment variables
const config = {
    user: process.env.DB_USER || 'sa',  // Use DB_USER from .env or default to 'sa'
    password: process.env.DB_PASSWORD || 'Tohid-Card@100btc',  // Use DB_PASSWORD from .env or default
    server: process.env.DB_SERVER || '141.98.210.182',  // Use DB_SERVER from .env or default
    port: parseInt(process.env.DB_PORT, 10) || 14333,  // Parse DB_PORT to integer or default to 14333
    database: process.env.DB_NAME || 'TcardDB',  // Use DB_NAME from .env or default
    options: {
        encrypt: false,  // Change to 'true' if encryption is required
        trustServerCertificate: true,  // Set to 'true' for self-signed certificates
        connectTimeout: 30000,  // Increase connection timeout to 30 seconds
    }
};

// Log the database configuration to confirm it's loaded correctly
console.log('Database configuration:', config);
console.log('Port type:', typeof config.port);

/** ⭐ Singleton connection pool */
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

/** Function to get user by username */
async function getUserByUsername(username) {
    try {
        const pool = await poolPromise;
        const res = await pool.request()
            .input('Username', sql.NVarChar, username)
            .query('SELECT * FROM Users WHERE Username = @Username');
        return res.recordset[0];
    } catch (err) {
        console.error('❌ Error fetching user by username:', err);
        throw err;  // Rethrow the error after logging it
    }
}

// Export the necessary modules
module.exports = { sql, poolPromise, getUserByUsername };