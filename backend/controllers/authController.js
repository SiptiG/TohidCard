import jwt from 'jsonwebtoken';
import { getUserByUsername } from '../services/db.services.js';

export const loginUser = async (req, res) => {
    const { username, password } = req.body;

    try {
        const user = await getUserByUsername(username);
        if (!user || user.PasswordHash !== password) { // In production, use bcrypt for password hashing
            return res.status(401).json({ message: 'Invalid username or password' });
        }

        const token = jwt.sign(
            { userId: user.UserID, username: user.Username },
            process.env.JWT_SECRET,
            { expiresIn: '1h' }
        );

        res.cookie('token', token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            maxAge: 3600000 // 1 hour
        });

        return res.status(200).json({ message: 'Login successful', user: { userId: user.UserID, username: user.Username } });
    } catch (err) {
        console.error('Error during login:', err);
        return res.status(500).json({ message: 'Server error' });
    }
};