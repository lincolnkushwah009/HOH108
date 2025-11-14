const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth');
const { isAdmin } = require('../middleware/adminAuth');
const {
  getAllLeads,
  getLead,
  updateLead,
  deleteLead,
  getLeadStats
} = require('../controllers/leadController');

// Protect all routes (require authentication)
router.use(protect);

// Require admin role for all routes
router.use(isAdmin);

// Statistics route (must come before /:id)
router.get('/stats', getLeadStats);

// Main CRUD routes
router.route('/')
  .get(getAllLeads);

router.route('/:id')
  .get(getLead)
  .put(updateLead)
  .delete(deleteLead);

module.exports = router;
