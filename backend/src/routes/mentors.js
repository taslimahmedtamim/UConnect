const express = require('express');
const router = express.Router();
const { createMentorConnection, getMentors } = require('../controllers/mentorController');
const { authenticate } = require('../middleware/auth');

router.use(authenticate);

router.post('/', createMentorConnection);
router.get('/', getMentors);

module.exports = router;
