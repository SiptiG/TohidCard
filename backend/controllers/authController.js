import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import { getUserByUsername, insertUser } from '../services/db.services.js';

export const loginUser = async (req, res) => {
    const { username, password } = req.body;
    try {
        const user = await getUserByUsername(username);
        if (!user) {
            return res.status(401).json({ message: 'Invalid username or password' });
        }
        const validPassword = await bcrypt.compare(password, user.PasswordHash);
        if (!validPassword) {
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
            maxAge: 3600000, // 1 hour
            sameSite: 'strict' // Enhanced security
        });
        return res.status(200).json({ message: 'Login successful', user: { userId: user.UserID, username: user.Username } });
    } catch (err) {
        console.error('Error during login:', err);
        return res.status(500).json({ message: 'Server error', error: err.message });
    }
};

export const signUpUser = async (req, res) => {
    const { username, email, number, password, firstName, lastName, nationalID } = req.body;
    console.log('Received sign-up data:', req.body);
    if (!username || !password || !number || !firstName || !lastName || !nationalID) {
        return res.status(400).json({ message: 'All fields are required' });
    }
    try {
        const existingUser = await getUserByUsername(username);
        if (existingUser) {
            return res.status(400).json({ message: 'Username already exists' });
        }
        const salt = await bcrypt.genSalt(10);
        const passwordHash = await bcrypt.hash(password, salt);
        await insertUser(username, passwordHash, salt, number, firstName, lastName, nationalID);
        console.log('User inserted successfully');
        return res.status(201).json({ message: 'User created successfully' });
    } catch (err) {
        console.error('Error during sign-up:', err);
        return res.status(500).json({ message: 'Server error', error: err.message });
    }
};