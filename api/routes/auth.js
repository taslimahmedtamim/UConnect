const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { isDbConnected, memoryStore, User } = require('../store');

const JWT_SECRET = process.env.JWT_SECRET || 'uconnect_secret_jwt_key_2025_safe_hash';

// Helper to generate JWT
const generateToken = (userId, email, role) => {
    return jwt.sign({ id: userId, email, role }, JWT_SECRET, { expiresIn: '7d' });
};

// @route   POST /api/auth/register
// @desc    Register a new user
router.post('/register', async (req, res) => {
    try {
        const { fullName, email, password, role, university } = req.body;

        if (!fullName || !email || !password) {
            return res.status(400).json({ success: false, message: 'Please provide full name, email, and password.' });
        }

        const normalizedEmail = email.toLowerCase().trim();

        if (isDbConnected()) {
            const existingUser = await User.findOne({ email: normalizedEmail });
            if (existingUser) {
                return res.status(400).json({ success: false, message: 'An account with this email already exists.' });
            }

            const salt = await bcrypt.genSalt(10);
            const hashedPassword = await bcrypt.hash(password, salt);

            const user = await User.create({
                fullName,
                email: normalizedEmail,
                password: hashedPassword,
                role: role || 'student',
                university: university || ''
            });

            const token = generateToken(user._id, user.email, user.role);

            return res.status(201).json({
                success: true,
                message: 'Account registered successfully',
                token,
                user: {
                    id: user._id,
                    fullName: user.fullName,
                    email: user.email,
                    role: user.role,
                    university: user.university,
                    xp: user.xp,
                    streak: user.streak,
                    avatar: user.avatar
                }
            });
        } else {
            // Memory Store Mode
            const existing = memoryStore.users.find(u => u.email === normalizedEmail);
            if (existing) {
                return res.status(400).json({ success: false, message: 'An account with this email already exists.' });
            }

            const hashedPassword = await bcrypt.hash(password, 10);
            const newUser = {
                _id: 'user_' + Date.now(),
                fullName,
                email: normalizedEmail,
                password: hashedPassword,
                role: role || 'student',
                university: university || '',
                department: '',
                bio: 'Student developer on UConnect.',
                avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
                skills: [],
                xp: 0,
                streak: 0,
                badges: []
            };

            memoryStore.users.push(newUser);
            const token = generateToken(newUser._id, newUser.email, newUser.role);

            return res.status(201).json({
                success: true,
                message: 'Account registered successfully (Local Dev Mode)',
                token,
                user: {
                    id: newUser._id,
                    fullName: newUser.fullName,
                    email: newUser.email,
                    role: newUser.role,
                    university: newUser.university,
                    xp: newUser.xp,
                    streak: newUser.streak,
                    avatar: newUser.avatar
                }
            });
        }
    } catch (error) {
        console.error('Registration Error:', error);
        res.status(500).json({ success: false, message: 'Server error during registration', error: error.message });
    }
});

// @route   POST /api/auth/login
// @desc    Authenticate user & get token
router.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({ success: false, message: 'Please enter both email and password.' });
        }

        const normalizedEmail = email.toLowerCase().trim();

        if (isDbConnected()) {
            const user = await User.findOne({ email: normalizedEmail });
            if (!user) {
                return res.status(401).json({ success: false, message: 'Invalid credentials.' });
            }

            const isMatch = await bcrypt.compare(password, user.password);
            if (!isMatch) {
                return res.status(401).json({ success: false, message: 'Invalid credentials.' });
            }

            const token = generateToken(user._id, user.email, user.role);

            return res.json({
                success: true,
                message: 'Login successful',
                token,
                user: {
                    id: user._id,
                    fullName: user.fullName,
                    email: user.email,
                    role: user.role,
                    university: user.university,
                    xp: user.xp,
                    streak: user.streak,
                    avatar: user.avatar
                }
            });
        } else {
            // Memory Store Mode
            let user = memoryStore.users.find(u => u.email === normalizedEmail);

            if (!user) {
                return res.status(401).json({ success: false, message: 'Invalid credentials.' });
            }

            const isMatch = await bcrypt.compare(password, user.password);
            if (!isMatch) {
                return res.status(401).json({ success: false, message: 'Invalid credentials.' });
            }

            const token = generateToken(user._id, user.email, user.role);

            return res.json({
                success: true,
                message: 'Login successful (Local Dev Mode)',
                token,
                user: {
                    id: user._id,
                    fullName: user.fullName,
                    email: user.email,
                    role: user.role,
                    university: user.university,
                    xp: user.xp,
                    streak: user.streak,
                    avatar: user.avatar
                }
            });
        }
    } catch (error) {
        console.error('Login Error:', error);
        res.status(500).json({ success: false, message: 'Server error during login', error: error.message });
    }
});

// @route   POST /api/auth/google
// @desc    Authenticate with Google OAuth
router.post('/google', async (req, res) => {
    try {
        const { email, name, avatar, role } = req.body;
        const userEmail = email || 'google.user@university.edu';
        const userName = name || 'Google Student';
        const userAvatar = avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80';

        if (isDbConnected()) {
            let user = await User.findOne({ email: userEmail });
            if (!user) {
                user = await User.create({
                    fullName: userName,
                    email: userEmail,
                    password: await bcrypt.hash('google_oauth_pass', 10),
                    role: role || 'student',
                    avatar: userAvatar,
                    university: 'Verified Google Account'
                });
            }
            const token = generateToken(user._id, user.email, user.role);
            return res.json({
                success: true,
                message: 'Google login successful',
                token,
                user: { id: user._id, fullName: user.fullName, email: user.email, role: user.role, avatar: user.avatar, xp: user.xp, streak: user.streak }
            });
        } else {
            let user = memoryStore.users.find(u => u.email === userEmail);
            if (!user) {
                user = {
                    _id: 'user_google_' + Date.now(),
                    fullName: userName,
                    email: userEmail,
                    role: role || 'student',
                    avatar: userAvatar,
                    university: 'Verified Google Account',
                    xp: 1200,
                    streak: 5
                };
                memoryStore.users.push(user);
            }
            const token = generateToken(user._id, user.email, user.role);
            return res.json({
                success: true,
                message: 'Google login successful (Local Mode)',
                token,
                user
            });
        }
    } catch (error) {
        res.status(500).json({ success: false, message: 'Google authentication error', error: error.message });
    }
});

// @route   POST /api/auth/github
// @desc    Authenticate with GitHub OAuth
router.post('/github', async (req, res) => {
    try {
        const { email, name, avatar, role } = req.body;
        const userEmail = email || 'github.user@university.edu';
        const userName = name || 'GitHub Developer';
        const userAvatar = avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80';

        let user = memoryStore.users.find(u => u.email === userEmail);
        if (!user) {
            user = {
                _id: 'user_github_' + Date.now(),
                fullName: userName,
                email: userEmail,
                role: role || 'student',
                avatar: userAvatar,
                university: 'Verified GitHub Developer',
                xp: 1500,
                streak: 10
            };
            memoryStore.users.push(user);
        }
        const token = generateToken(user._id, user.email, user.role);
        return res.json({
            success: true,
            message: 'GitHub login successful',
            token,
            user
        });
    } catch (error) {
        res.status(500).json({ success: false, message: 'GitHub authentication error', error: error.message });
    }
});

// @route   GET /api/auth/me
// @desc    Get current user details from JWT token
router.get('/me', async (req, res) => {
    try {
        const authHeader = req.headers.authorization;
        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            return res.status(401).json({ success: false, message: 'No authorization token provided.' });
        }

        const token = authHeader.split(' ')[1];
        const decoded = jwt.verify(token, JWT_SECRET);

        if (isDbConnected()) {
            const user = await User.findById(decoded.id).select('-password');
            if (!user) {
                return res.status(404).json({ success: false, message: 'User not found.' });
            }
            return res.json({ success: true, user });
        } else {
            const user = memoryStore.users.find(u => u._id === decoded.id) || memoryStore.users[0];
            const { password, ...userWithoutPassword } = user;
            return res.json({ success: true, user: userWithoutPassword });
        }
    } catch (error) {
        return res.status(401).json({ success: false, message: 'Invalid or expired token', error: error.message });
    }
});

module.exports = router;

