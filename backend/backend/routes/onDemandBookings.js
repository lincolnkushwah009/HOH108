const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth');
const { isAdmin } = require('../middleware/adminAuth');
const {
  getAllBookings,
  getBooking,
  createBooking,
  updateBooking,
  assignProvider,
  updateBookingStatus,
  verifyOTP,
  addRating,
  rescheduleBooking,
  getBookingStats,
  getMyBookings,
  getProviderBookings,
  trackBooking,
  requestCompletionOTP,
  verifyCompletionOTP
} = require('../controllers/onDemandBookingController');

// Public routes
router.post('/create', createBooking);
router.post('/track', trackBooking);
router.post('/:id/verify-otp', verifyOTP);

// Protected routes (Authenticated users)
router.use(protect);

router.get('/my-bookings', getMyBookings);
router.get('/:id', getBooking);
router.post('/:id/rating', addRating);
router.post('/:id/reschedule', rescheduleBooking);
router.put('/:id/status', updateBookingStatus);
router.post('/:id/request-completion-otp', requestCompletionOTP);
router.post('/:id/verify-completion-otp', verifyCompletionOTP);

// Admin routes
router.get('/', isAdmin, getAllBookings);
router.put('/:id', isAdmin, updateBooking);
router.put('/:id/assign-provider', isAdmin, assignProvider);
router.get('/stats/overview', isAdmin, getBookingStats);
router.get('/provider/:providerId', isAdmin, getProviderBookings);

module.exports = router;
