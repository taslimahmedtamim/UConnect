const express = require('express');
const router = express.Router();
const { generateResume, getResumeById } = require('../controllers/resumeController');
const { authenticate } = require('../middleware/auth');

router.use(authenticate);

router.post('/generate', generateResume);
router.get('/:id', getResumeById);

module.exports = router;
