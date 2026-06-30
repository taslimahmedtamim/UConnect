const express = require('express');
const router = express.Router();
const { getUsers, getUserById, updateUser, deleteUser } = require('../controllers/userController');
const { getProfile, updateProfile, addSkills, removeSkill } = require('../controllers/profileController');
const { getUserApplications } = require('../controllers/opportunityController');
const { getUserAchievements } = require('../controllers/achievementController');
const { getUserMentorConnections } = require('../controllers/mentorController');
const { getUserResumes } = require('../controllers/resumeController');
const { authenticate } = require('../middleware/auth');

// All user routes require authentication
router.use(authenticate);

// User CRUD
router.get('/', getUsers);
router.get('/:id', getUserById);
router.put('/:id', updateUser);
router.delete('/:id', deleteUser);

// Profile
router.get('/:id/profile', getProfile);
router.put('/:id/profile', updateProfile);

// Skills
router.post('/:id/skills', addSkills);
router.delete('/:id/skills/:skillId', removeSkill);

// User's applications
router.get('/:id/applications', getUserApplications);

// User's achievements
router.get('/:id/achievements', getUserAchievements);

// User's mentor connections
router.get('/:id/mentors', getUserMentorConnections);

// User's resumes
router.get('/:id/resumes', getUserResumes);

module.exports = router;
