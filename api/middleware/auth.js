const jwt = require('jsonwebtoken');
const { isDbConnected, User, memoryStore } = require('../store');

const JWT_SECRET = process.env.JWT_SECRET || 'uconnect_secret_jwt_key_2025_safe_hash';

module.exports = async (req, res, next) => {
    // Get token from header
    const authHeader = req.header('Authorization');

    // Check if no token
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).json({ success: false, message: 'No token, authorization denied' });
    }

    const token = authHeader.split(' ')[1];

    try {
        // Verify token
        const decoded = jwt.verify(token, JWT_SECRET);
        req.user = decoded;
        
        // Optional: you could fetch the full user from DB here if needed
        // but often the decoded JWT (id, email, role) is enough for auth

        next();
    } catch (err) {
        res.status(401).json({ success: false, message: 'Token is not valid' });
    }
};
