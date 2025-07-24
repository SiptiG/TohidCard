import express from 'express';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import { poolPromise } from './services/db.services.js';
import authRoutes from './routes/authRoutes.js';
import { authenticateToken } from './middleware/authMiddleware.js';

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware setup
app.use(express.json());        // Parse JSON request bodies
app.use(cookieParser());        // Parse cookies for authentication
app.use(cors({
    origin: 'http://localhost:5173', // Allow frontend origin
    credentials: true // Allow cookies/credentials
}));

// Mount authentication routes
app.use('/api/auth', authRoutes);

// Sample protected route to test token/user identification
app.get('/api/protected', authenticateToken, (req, res) => {
    res.json({ message: 'This is a protected route', user: req.user });
});

// Function to log users table data and verify database connection
async function logUsersTable() {
    try {
        const pool = await poolPromise;
        const result = await pool.request().query('SELECT * FROM dbo.Users');
        console.log('Users Table Data:');
        console.table(result.recordset);
    } catch (err) {
        console.error('Error fetching users table:', err);
    }
}

// Log users table when server starts
logUsersTable();

// Start the server
const server = app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});

server.on('error', (err) => {
    console.error('Server failed to start:', err.message);
});