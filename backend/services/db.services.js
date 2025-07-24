import 'dotenv/config';
import sql from 'mssql';

const config = {
    user: process.env.DB_USER || 'sa',
    password: process.env.DB_PASSWORD || 'Tohid-Card@100btc',
    server: process.env.DB_HOST || '141.98.210.182',
    port: parseInt(process.env.DB_PORT, 10) || 14333,
    database: process.env.DB_NAME || 'TCardDB',
    options: {
        encrypt: false,
        trustServerCertificate: true,
        connectTimeout: 30000,
    }
};

const poolPromise = new sql.ConnectionPool(config)
    .connect()
    .then(pool => {
        console.log('✅ MSSQL connected (singleton)');
        return pool;
    })
    .catch(err => {
        console.error('❌ MSSQL connection error:', err);
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

async function insertUser(username, passwordHash, salt, mobileNumber, firstName, lastName, nationalID) {
    try {
        const pool = await poolPromise;
        await pool.request()
            .input('Username', sql.NVarChar, username)
            .input('PasswordHash', sql.NVarChar, passwordHash)
            .input('Salt', sql.NVarChar, salt)
            .input('MobileNumber', sql.NVarChar, mobileNumber)
            .input('FirstName', sql.NVarChar, firstName)
            .input('LastName', sql.NVarChar, lastName)
            .input('NationalID', sql.NVarChar, nationalID)
            .query(`
                INSERT INTO Users (Username, PasswordHash, Salt, CreatedAt, MobileNumber, IsEnable, RoleID, FirstName, LastName, NationalID)
                VALUES (@Username, @PasswordHash, @Salt, GETDATE(), @MobileNumber, 1, 1, @FirstName, @LastName, @NationalID)
            `);
    } catch (err) {
        console.error('❌ Error inserting user:', err);
        throw err;
    }
}

export { sql, poolPromise, getUserByUsername, insertUser };