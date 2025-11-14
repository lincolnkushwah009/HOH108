const express = require('express');
const router = express.Router();
const dashboardController = require('../controllers/dashboardController');
const { protect, authorize } = require('../middleware/auth');

// Protect all routes and authorize for admin/super_admin/manager/designer/crm
router.use(protect);
router.use(authorize('admin', 'super_admin', 'interior_admin', 'construction_admin', 'renovation_admin', 'on_demand_admin', 'manager', 'designer', 'crm'));

// Dashboard statistics route
router.get('/stats', dashboardController.getDashboardStats);

// Recent activities route
router.get('/recent-activities', dashboardController.getRecentActivities);

module.exports = router;
