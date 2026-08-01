const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const { isDbConnected, memoryStore } = require('../store');

const JWT_SECRET = process.env.JWT_SECRET || 'uconnect_secret_jwt_key_2025_safe_hash';

const getUser = (req) => {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) return null;
    try {
        const token = authHeader.split(' ')[1];
        return jwt.verify(token, JWT_SECRET);
    } catch (e) {
        return null;
    }
};

// @route   GET /api/messages
// @desc    Get recent messages for current user
router.get('/', (req, res) => {
    const user = getUser(req);
    const msgs = memoryStore.messages.filter(m => !user || m.recipient.id === user.id || m.sender.id === user.id);
    res.json({ success: true, count: msgs.length, messages: msgs.length ? msgs : memoryStore.messages });
});

// @route   POST /api/messages
// @desc    Send a message
router.post('/', (req, res) => {
    const user = getUser(req);
    const { recipientId, recipientName, content } = req.body;

    if (!content) {
        return res.status(400).json({ success: false, message: 'Message content is required.' });
    }

    const newMessage = {
        _id: 'msg_' + Date.now(),
        sender: {
            id: user ? user.id : 'user_demo_1',
            name: user ? (user.fullName || user.email.split('@')[0]) : 'Alex Rivera'
        },
        recipient: {
            id: recipientId || 'user_demo_2',
            name: recipientName || 'Team Member'
        },
        content,
        timestamp: new Date().toISOString()
    };

    memoryStore.messages.push(newMessage);
    res.status(201).json({ success: true, message: 'Message sent', data: newMessage });
});

module.exports = router;
