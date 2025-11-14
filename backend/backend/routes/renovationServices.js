const express = require('express');
const router = express.Router();
const renovationServiceController = require('../controllers/renovationServiceController');
const { protect, adminOnly } = require('../middleware/auth');

// Public routes
router.get('/', renovationServiceController.getAllServices);
router.get('/:id', renovationServiceController.getServiceById);

// Admin routes
router.get('/admin/all', protect, adminOnly, renovationServiceController.adminGetAllServices);
router.get('/admin/stats', protect, adminOnly, renovationServiceController.getServiceStats);
router.post('/admin', protect, adminOnly, renovationServiceController.createService);
router.put('/admin/:id', protect, adminOnly, renovationServiceController.updateService);
router.delete('/admin/:id', protect, adminOnly, renovationServiceController.deleteService);
router.patch('/admin/:id/toggle-active', protect, adminOnly, renovationServiceController.toggleActive);
router.patch('/admin/:id/toggle-popular', protect, adminOnly, renovationServiceController.togglePopular);

module.exports = router;
