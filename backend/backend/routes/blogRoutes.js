const express = require('express');
const router = express.Router();
const {
  getAllBlogs,
  getBlogById,
  adminGetAllBlogs,
  createBlog,
  updateBlog,
  deleteBlog,
  togglePublish,
  getBlogStats
} = require('../controllers/blogController');
const { protect, authorize } = require('../middleware/auth');

// Admin routes - MUST come before public routes to avoid route conflicts
router.get('/admin/all', protect, authorize('admin', 'super_admin', 'interior_admin', 'construction_admin', 'renovation_admin', 'on_demand_admin'), adminGetAllBlogs);
router.get('/admin/stats', protect, authorize('admin', 'super_admin', 'interior_admin', 'construction_admin', 'renovation_admin', 'on_demand_admin'), getBlogStats);
router.post('/admin/create', protect, authorize('admin', 'super_admin', 'interior_admin', 'construction_admin', 'renovation_admin', 'on_demand_admin'), createBlog);
router.put('/admin/:id', protect, authorize('admin', 'super_admin', 'interior_admin', 'construction_admin', 'renovation_admin', 'on_demand_admin'), updateBlog);
router.delete('/admin/:id', protect, authorize('admin', 'super_admin', 'interior_admin', 'construction_admin', 'renovation_admin', 'on_demand_admin'), deleteBlog);
router.patch('/admin/:id/toggle-publish', protect, authorize('admin', 'super_admin', 'interior_admin', 'construction_admin', 'renovation_admin', 'on_demand_admin'), togglePublish);

// Public routes
router.get('/', getAllBlogs);
router.get('/:id', getBlogById);

module.exports = router;
