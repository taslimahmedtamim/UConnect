const express = require('express');
const router = express.Router();
const {
  createOpportunity,
  getOpportunities,
  getOpportunityById,
  applyToOpportunity,
  updateApplicationStatus,
} = require('../controllers/opportunityController');
const { authenticate, authorize } = require('../middleware/auth');

router.use(authenticate);

router.get('/', getOpportunities);
router.get('/:id', getOpportunityById);
router.post('/', createOpportunity);
router.post('/:id/apply', applyToOpportunity);

// Application management
router.put('/applications/:id/status', updateApplicationStatus);

module.exports = router;
