const express = require('express');
const router = express.Router();
const renovationBookingController = require('../controllers/renovationBookingController');
const { protect, adminOnly } = require('../middleware/auth');

// Public routes
router.post('/', renovationBookingController.createBooking);
router.get('/:id', renovationBookingController.getBookingById);

// Admin routes
router.get('/admin/all', protect, adminOnly, renovationBookingController.adminGetAllBookings);
router.get('/admin/stats', protect, adminOnly, renovationBookingController.getBookingStats);
router.put('/admin/:id', protect, adminOnly, renovationBookingController.updateBooking);
router.patch('/admin/:id/status', protect, adminOnly, renovationBookingController.updateBookingStatus);
router.patch('/admin/:id/assign', protect, adminOnly, renovationBookingController.assignBooking);
router.post('/admin/:id/quotation', protect, adminOnly, renovationBookingController.sendQuotation);
router.delete('/admin/:id', protect, adminOnly, renovationBookingController.deleteBooking);

module.exports = router;
