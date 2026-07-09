const express = require('express');
const router = express.Router();
const { awardAchievement, getLeaderboard } = require('../controllers/achievementController');
const { authenticate } = require('../middleware/auth');

router.use(authenticate);

router.post('/', awardAchievement);
router.get('/leaderboard', getLeaderboard);

module.exports = router;
