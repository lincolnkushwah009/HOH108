const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth');
const { isAdmin, hasPermission } = require('../middleware/adminAuth');
const {
  getAllUsers,
  getUser,
  createUser,
  updateUser,
  deleteUser,
  updateUserPermissions,
  getUserStats,
  changeUserPassword
} = require('../controllers/userController');

// Protect all routes (require authentication)
router.use(protect);

// Require admin role for all routes
router.use(isAdmin);

// Statistics route (must come before /:id)
router.get('/stats', hasPermission('view_dashboard'), getUserStats);

// Main CRUD routes
router.route('/')
  .get(hasPermission('view_users'), getAllUsers)
  .post(hasPermission('create_users'), createUser);

router.route('/:id')
  .get(hasPermission('view_users'), getUser)
  .put(hasPermission('edit_users'), updateUser)
  .delete(hasPermission('delete_users'), deleteUser);

// Permissions management
router.patch('/:id/permissions', hasPermission('manage_permissions'), updateUserPermissions);

// Password management
router.put('/:id/change-password', hasPermission('edit_users'), changeUserPassword);

module.exports = router;
