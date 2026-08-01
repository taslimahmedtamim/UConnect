const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const { isDbConnected, memoryStore, Team } = require('../store');

const JWT_SECRET = process.env.JWT_SECRET || 'uconnect_secret_jwt_key_2025_safe_hash';

const getOptionalUser = (req) => {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) return null;
    try {
        const token = authHeader.split(' ')[1];
        return jwt.verify(token, JWT_SECRET);
    } catch (e) {
        return null;
    }
};

// @route   GET /api/teams
// @desc    Get all teams
router.get('/', async (req, res) => {
    try {
        if (isDbConnected()) {
            const teams = await Team.find().sort({ createdAt: -1 });
            return res.json({ success: true, count: teams.length, teams });
        } else {
            return res.json({ success: true, count: memoryStore.teams.length, teams: memoryStore.teams });
        }
    } catch (error) {
        res.status(500).json({ success: false, message: 'Error fetching teams', error: error.message });
    }
});

// @route   POST /api/teams
// @desc    Create a new team
router.post('/', async (req, res) => {
    try {
        const user = getOptionalUser(req);
        const { name, description, domain, lookingFor, maxMembers } = req.body;

        if (!name) {
            return res.status(400).json({ success: false, message: 'Team name is required.' });
        }

        const teamData = {
            name,
            description: description || 'Collaborative team working on innovative technology.',
            domain: domain || 'General',
            lookingFor: lookingFor || ['Developer', 'Designer'],
            membersCount: 1,
            maxMembers: maxMembers || 5,
            leader: {
                id: user ? user.id : 'user_demo_1',
                name: user ? (user.fullName || user.email.split('@')[0]) : 'Alex Rivera',
                avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80'
            },
            members: [
                {
                    id: user ? user.id : 'user_demo_1',
                    name: user ? (user.fullName || user.email.split('@')[0]) : 'Alex Rivera',
                    role: 'Team Lead',
                    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80'
                }
            ]
        };

        if (isDbConnected()) {
            const team = await Team.create(teamData);
            return res.status(201).json({ success: true, message: 'Team created successfully', team });
        } else {
            const newTeam = { _id: 'team_' + Date.now(), ...teamData, createdAt: new Date().toISOString() };
            memoryStore.teams.unshift(newTeam);
            return res.status(201).json({ success: true, message: 'Team created successfully (Dev Mode)', team: newTeam });
        }
    } catch (error) {
        res.status(500).json({ success: false, message: 'Error creating team', error: error.message });
    }
});

// @route   POST /api/teams/:id/join
// @desc    Join a team
router.post('/:id/join', async (req, res) => {
    try {
        const user = getOptionalUser(req);
        const { id } = req.params;
        const memberName = user ? (user.fullName || user.email.split('@')[0]) : 'New Member';

        if (isDbConnected()) {
            const team = await Team.findById(id);
            if (!team) return res.status(404).json({ success: false, message: 'Team not found' });
            if (team.membersCount >= team.maxMembers) {
                return res.status(400).json({ success: false, message: 'Team is full' });
            }
            team.members.push({ id: user ? user.id : 'user_' + Date.now(), name: memberName, role: 'Member', avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80' });
            team.membersCount = team.members.length;
            await team.save();
            return res.json({ success: true, message: 'Joined team successfully', team });
        } else {
            const team = memoryStore.teams.find(t => t._id === id);
            if (!team) return res.status(404).json({ success: false, message: 'Team not found' });
            if (team.membersCount >= team.maxMembers) {
                return res.status(400).json({ success: false, message: 'Team is full' });
            }
            team.members.push({ id: user ? user.id : 'user_' + Date.now(), name: memberName, role: 'Member', avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80' });
            team.membersCount = team.members.length;
            return res.json({ success: true, message: 'Joined team successfully (Dev Mode)', team });
        }
    } catch (error) {
        res.status(500).json({ success: false, message: 'Error joining team', error: error.message });
    }
});

module.exports = router;
