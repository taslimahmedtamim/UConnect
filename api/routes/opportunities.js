const express = require('express');
const router = express.Router();
const { isDbConnected, memoryStore, Opportunity } = require('../store');

const auth = require('../middleware/auth');

// @route   GET /api/opportunities
// @desc    Get all opportunities / jobs / internships
router.get('/', async (req, res) => {
    try {
        if (isDbConnected()) {
            const opportunities = await Opportunity.find().sort({ createdAt: -1 });
            return res.json({ success: true, count: opportunities.length, opportunities });
        } else {
            return res.json({ success: true, count: memoryStore.opportunities.length, opportunities: memoryStore.opportunities });
        }
    } catch (error) {
        res.status(500).json({ success: false, message: 'Error fetching opportunities', error: error.message });
    }
});

// @route   POST /api/opportunities
// @desc    Post a new opportunity
router.post('/', auth, async (req, res) => {
    try {
        const { title, company, type, location, stipend, description, skills, deadline } = req.body;

        if (!title || !company) {
            return res.status(400).json({ success: false, message: 'Title and company are required.' });
        }

        const data = {
            title,
            company,
            logo: '💼',
            type: type || 'Internship',
            location: location || 'Remote',
            stipend: stipend || 'Competitive',
            description: description || 'Exciting opportunity for university students and graduates.',
            skills: skills || ['Communication', 'Problem Solving'],
            deadline: deadline || '2025-12-31'
        };

        if (isDbConnected()) {
            const opp = await Opportunity.create(data);
            return res.status(201).json({ success: true, message: 'Opportunity posted', opportunity: opp });
        } else {
            const newOpp = { _id: 'opp_' + Date.now(), ...data, createdAt: new Date().toISOString() };
            memoryStore.opportunities.unshift(newOpp);
            return res.status(201).json({ success: true, message: 'Opportunity posted (Dev Mode)', opportunity: newOpp });
        }
    } catch (error) {
        res.status(500).json({ success: false, message: 'Error posting opportunity', error: error.message });
    }
});

module.exports = router;
