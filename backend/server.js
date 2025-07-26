// server.js
import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import dotenv from 'dotenv';

import authRoutes from './routes/auth.routes.js';
import { authenticateToken } from './middleware/auth.middleware.js';
import { poolPromise } from './services/db.services.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

/* ──────────────── MIDDLEWARE ──────────────── */
app.use(express.json());            // body‑parser
app.use(cookieParser());            // read/write cookies

app.use(
    cors({
        origin: 'http://localhost:5173', // React dev host
        credentials: true               // allow cookies
    })
);

/* ─────────────── ROUTES ─────────────── */
app.use('/api/auth', authRoutes);

/* demo protected route */
app.get('/api/protected', authenticateToken, (req, res) => {
    res.json({ message: 'This is a protected route', user: req.user });
});

/* ────────── OPTIONAL: DB sanity check ───────── */
async function logUsersTable() {
    try {
        const pool = await poolPromise;
        const result = await pool.request().query('SELECT * FROM dbo.Users');
        console.log('── Users table snapshot ──');
        console.table(result.recordset);
    } catch (err) {
        console.error('Error fetching users table:', err);
    }
}
logUsersTable();

/* ─────────────── START ─────────────── */
const server = app.listen(PORT, () =>
    console.log(`API listening on http://localhost:${PORT}`)
);

server.on('error', err =>
    console.error('Server failed to start:', err.message)
);