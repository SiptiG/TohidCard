import jwt from 'jsonwebtoken';

export const authenticateToken = (req, res, next) => {
    const token = req.cookies.token; // Read token from httpOnly cookie
    if (!token) {
        return res.status(401).json({ message: 'Access denied: No token provided' });
    }
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded; // Attach user info to req for identification in routes
        next();
    } catch (err) {
        return res.status(403).json({ message: 'Invalid or expired token' });
    }
};