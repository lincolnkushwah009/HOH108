const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth');
const { isAdmin } = require('../middleware/adminAuth');
const {
  getAllProviders,
  getProvider,
  createProvider,
  updateProvider,
  deleteProvider,
  getAvailableProviders,
  updateProviderStatus,
  verifyDocuments,
  updateAvailability,
  getProviderStats,
  addReview,
  getMyBookings
} = require('../controllers/serviceProviderController');

// Public routes
router.get('/available/:serviceId', getAvailableProviders);

// Protected routes for providers (before admin middleware)
router.get('/my-bookings', protect, getMyBookings);

// Protected admin routes
router.use(protect);
router.use(isAdmin);

// Statistics route (must come before /:id)
router.get('/stats', getProviderStats);

// Main CRUD routes
router.route('/')
  .get(getAllProviders)
  .post(createProvider);

router.route('/:id')
  .get(getProvider)
  .put(updateProvider)
  .delete(deleteProvider);

// Provider management routes
router.put('/:id/status', updateProviderStatus);
router.put('/:id/verify-documents', verifyDocuments);
router.put('/:id/availability', updateAvailability);

// Review route (requires authentication, not necessarily admin)
router.post('/:id/review', addReview);

module.exports = router;
