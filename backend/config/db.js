import sql from 'mssql';
import dotenv from 'dotenv';
dotenv.config();

const config = {
    user: process.env.DB_USER || 'sa',
    password: process.env.DB_PASSWORD || 'Tohid-Card@100btc',
    server: process.env.DB_HOST || '141.98.210.182',
    port: parseInt(process.env.DB_PORT, 10) || 14333,
    database: 'TCardDB',
    options: {
        encrypt: false,
        trustServerCertificate: true,
        connectTimeout: 30000,
    }
};

const poolPromise = new sql.ConnectionPool(config)
    .connect()
    .then(pool => {
        console.log('✅ MSSQL connected successfully');
        return pool;
    })
    .catch(err => {
        console.error('❌ MSSQL connection error:', err.message);
        throw err;
    });

export default poolPromise;