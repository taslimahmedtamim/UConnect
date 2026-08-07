const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const { isDbConnected, memoryStore } = require('../store');
const Message = require('../models/Message');

const JWT_SECRET = process.env.JWT_SECRET || 'uconnect_secret_jwt_key_2025_safe_hash';

const auth = require('../middleware/auth');

const getUser = (req) => {
    if (req.user) return req.user;
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
router.get('/', auth, async (req, res) => {
    try {
        const user = getUser(req);
        if (isDbConnected()) {
            let filter = {};
            if (user) {
                filter = {
                    $or: [
                        { 'recipient.id': user.id },
                        { 'sender.id': user.id }
                    ]
                };
            }
            const msgs = await Message.find(filter).sort({ createdAt: -1 });
            return res.json({ success: true, count: msgs.length, messages: msgs });
        } else {
            const msgs = memoryStore.messages.filter(m => !user || m.recipient.id === user.id || m.sender.id === user.id);
            return res.json({ success: true, count: msgs.length, messages: msgs.length ? msgs : memoryStore.messages });
        }
    } catch (error) {
        res.status(500).json({ success: false, message: 'Error fetching messages', error: error.message });
    }
});

// @route   POST /api/messages
// @desc    Send a message
router.post('/', auth, async (req, res) => {
    try {
        const user = getUser(req);
        const { recipientId, recipientName, content } = req.body;

        if (!content) {
            return res.status(400).json({ success: false, message: 'Message content is required.' });
        }

        const msgData = {
            sender: {
                id: user ? user.id : 'user_demo_1',
                name: user ? (user.fullName || user.email.split('@')[0]) : 'Alex Rivera'
            },
            recipient: {
                id: recipientId || 'user_demo_2',
                name: recipientName || 'Team Member'
            },
            content
        };

        if (isDbConnected()) {
            const newMsg = await Message.create(msgData);
            return res.status(201).json({ success: true, message: 'Message sent', data: newMsg });
        } else {
            const newMessage = {
                _id: 'msg_' + Date.now(),
                ...msgData,
                timestamp: new Date().toISOString()
            };
            memoryStore.messages.push(newMessage);
            return res.status(201).json({ success: true, message: 'Message sent (Dev Mode)', data: newMessage });
        }
    } catch (error) {
        res.status(500).json({ success: false, message: 'Error sending message', error: error.message });
    }
});

module.exports = router;
