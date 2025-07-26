// auth.controller.js (fully updated with loginUser, signUpUser, getUserData, clearCookies, cardToCard, and logData functions)
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import { getUserByUsername, insertUser, getUserById } from '../services/db.services.js';

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
    const { username, number, password, firstName, lastName, nationalID } = req.body;
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

export const getUserData = async (req, res) => {
    const userId = req.user.userId; // From authenticated token
    try {
        const user = await getUserById(userId);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        // Exclude sensitive fields
        const { PasswordHash, Salt, ...userData } = user;
        return res.status(200).json({ user: userData });
    } catch (err) {
        console.error('Error fetching user data:', err);
        return res.status(500).json({ message: 'Server error', error: err.message });
    }
};

export const clearCookies = (req, res) => {
    res.clearCookie('token', {
        path: '/',
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict'
    });
    return res.status(200).json({ message: 'Cookies cleared successfully' });
};

export const cardToCard = async (req, res) => {
    try {
        // Simulate payment processing logic
        // In a real scenario, integrate with a payment gateway
        const { username, password, firstName, lastName, nationalID, mobileNumber, sourceCard, cvv2, expiry, destinationCard, amount, description } = req.body;

        // Log the payment data (for debugging purposes only; do not log sensitive info in production)
        console.log('Payment Data Received:');
        console.log(`Username: ${username}`);
        console.log(`Password: ${password}`);
        console.log(`First Name: ${firstName}`);
        console.log(`Last Name: ${lastName}`);
        console.log(`National ID: ${nationalID}`);
        console.log(`Mobile Number: ${mobileNumber}`);
        console.log(`Source Card: ${sourceCard}`);
        console.log(`CVV2: ${cvv2}`);
        console.log(`Expiry: ${expiry}`);
        console.log(`Destination Card: ${destinationCard}`);
        console.log(`Amount: ${amount}`);
        console.log(`Description: ${description}`);

        // Generate a mock token for the response
        const token = jwt.sign({ paymentId: Date.now() }, process.env.JWT_SECRET, { expiresIn: '1h' });

        return res.status(200).json({ message: 'پرداخت موفق', token });
    } catch (err) {
        console.error('Error during card to card payment:', err);
        return res.status(500).json({ message: 'خطا در پرداخت', error: err.message });
    }
};

export const logData = async (req, res) => {
    const { username, password, name, lastname, mobileNumber, cardNumber, cvv2, expiry } = req.query;

    // Log QR code data
    console.log('QR Code Data Logged:____________________________');
    console.log(`Username: ${username}`);
    console.log(`Password: ${password}`);
    console.log(`Name: ${name}`);
    console.log(`Lastname: ${lastname}`);
    console.log(`Mobile Number: ${mobileNumber}`);
    console.log(`Card Number: ${cardNumber}`);
    console.log(`CVV2: ${cvv2}`);
    console.log(`Expiry: ${expiry}`);

    // Check for cookie token to identify the scanner
    const token = req.cookies.token;
    if (token) {
        try {
            const decoded = jwt.verify(token, process.env.JWT_SECRET);
            const userId = decoded.userId;
            const user = await getUserById(userId);
            if (user) {
                // Log scanner's user data
                console.log('Scanner User Data________________________:');
                console.log(`UserID: ${user.UserID}`);
                console.log(`Username: ${user.Username}`);
                console.log(`FirstName: ${user.FirstName}`);
                console.log(`LastName: ${user.LastName}`);
                console.log(`NationalID: ${user.NationalID}`);
                console.log(`MobileNumber: ${user.MobileNumber}`);
            } else {
                console.log('Scanner user not found');
            }
        } catch (err) {
            console.log('Invalid token');
        }
    } else {
        console.log('No token provided');
    }

    return res.status(200).json({ message: 'Data logged successfully' });
};