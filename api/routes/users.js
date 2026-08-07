const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const { isDbConnected, memoryStore, User } = require('../store');

const JWT_SECRET = process.env.JWT_SECRET || 'uconnect_secret_jwt_key_2025_safe_hash';

const auth = require('../middleware/auth');

// @route   GET /api/users/profile
// @desc    Get user profile data
router.get('/profile', auth, async (req, res) => {
    try {
        if (isDbConnected()) {
            const user = await User.findById(req.user.id).select('-password');
            return res.json({ success: true, user });
        } else {
            const user = memoryStore.users.find(u => u._id === req.user.id) || memoryStore.users[0];
            const { password, ...cleanUser } = user;
            return res.json({ success: true, user: cleanUser });
        }
    } catch (error) {
        res.status(500).json({ success: false, message: 'Error fetching user profile', error: error.message });
    }
});

// @route   PUT /api/users/profile
// @desc    Update user profile
router.put('/profile', auth, async (req, res) => {
    try {
        const { fullName, bio, university, department, skills } = req.body;

        if (isDbConnected()) {
            const user = await User.findById(req.user.id);
            if (!user) return res.status(404).json({ success: false, message: 'User not found.' });

            if (fullName) user.fullName = fullName;
            if (bio) user.bio = bio;
            if (university) user.university = university;
            if (department) user.department = department;
            if (skills && Array.isArray(skills)) user.skills = skills;

            await user.save();
            return res.json({ success: true, message: 'Profile updated successfully', user });
        } else {
            const user = memoryStore.users.find(u => u._id === req.user.id) || memoryStore.users[0];
            if (fullName) user.fullName = fullName;
            if (bio) user.bio = bio;
            if (university) user.university = university;
            if (department) user.department = department;
            if (skills && Array.isArray(skills)) user.skills = skills;

            return res.json({ success: true, message: 'Profile updated successfully (Dev Mode)', user });
        }
    } catch (error) {
        res.status(500).json({ success: false, message: 'Error updating profile', error: error.message });
    }
});

module.exports = router;
