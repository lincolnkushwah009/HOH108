const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth');
const { isAdmin } = require('../middleware/adminAuth');
const {
  getAllServices,
  getService,
  createService,
  updateService,
  deleteService,
  getServicesByCategory,
  getPopularServices,
  getCategories,
  updateServiceRating,
  getServiceStats
} = require('../controllers/onDemandServiceController');

// Public routes
router.get('/', getAllServices);
router.get('/popular', getPopularServices);
router.get('/categories', getCategories);
router.get('/category/:category', getServicesByCategory);
router.get('/:id', getService);

// Protected routes (Admin only)
router.post('/', protect, isAdmin, createService);
router.put('/:id', protect, isAdmin, updateService);
router.delete('/:id', protect, isAdmin, deleteService);
router.get('/admin/stats', protect, isAdmin, getServiceStats);

// Rating (Protected - Authenticated users)
router.post('/:id/rating', protect, updateServiceRating);

module.exports = router;
