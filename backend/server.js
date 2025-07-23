import express from 'express';
import poolPromise from './config/db.js';

const app = express();
const PORT = process.env.PORT || 3001;
/*
// Function to fetch and console log users table data
async function logUsersTable() {
    try {
        // Await the poolPromise to get the ConnectionPool instance
        const pool = await poolPromise;
        // Use request().query() to execute the SQL query
        const result = await pool.request().query('SELECT * FROM dbo.users');
        console.log('Users Table Data:');
        console.table(result.recordset); // Display data in a table format for readability
    } catch (err) {
        console.error('Error fetching users table:', err);
    }
}

// Call the function to log users table data when the server starts
logUsersTable();
*/
// Start the Express server
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});