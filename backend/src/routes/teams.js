const express = require('express');
const router = express.Router();
const {
  createTeam,
  getTeams,
  getTeamById,
  addMember,
  updateMemberRole,
  removeMember,
} = require('../controllers/teamController');
const { authenticate } = require('../middleware/auth');

router.use(authenticate);

router.post('/', createTeam);
router.get('/', getTeams);
router.get('/:id', getTeamById);
router.post('/:id/members', addMember);
router.put('/:id/members/:userId', updateMemberRole);
router.delete('/:id/members/:userId', removeMember);

module.exports = router;
