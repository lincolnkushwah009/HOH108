const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth');
const { isAdmin, hasPermission } = require('../middleware/adminAuth');
const {
  getAllEmployees,
  getEmployee,
  createEmployee,
  updateEmployee,
  deleteEmployee,
  getEmployeesByRole,
  getEmployeeStats,
  changeEmployeePassword
} = require('../controllers/employeeController');

// Protect all routes (require authentication)
router.use(protect);

// Require admin role or employee roles for all routes
router.use((req, res, next) => {
  const allowedRoles = [
    'admin',
    'super_admin',
    'interior_admin',
    'construction_admin',
    'renovation_admin',
    'on_demand_admin',
    'manager',
    'designer',
    'crm'
  ];
  if (allowedRoles.includes(req.user.role)) {
    return next();
  }
  return res.status(403).json({
    success: false,
    message: 'Access denied. Admin or employee privileges required.'
  });
});

// Statistics route (must come before /:id)
router.get('/stats', getEmployeeStats);

// Get employees by role (must come before /:id)
router.get('/role/:role', getEmployeesByRole);

// Main CRUD routes
router.route('/')
  .get(hasPermission('view_employees'), getAllEmployees)
  .post(hasPermission('create_employees'), createEmployee);

router.route('/:id')
  .get(hasPermission('view_employees'), getEmployee)
  .put(hasPermission('edit_employees'), updateEmployee)
  .delete(hasPermission('delete_employees'), deleteEmployee);

// Change employee password route
router.put('/:id/change-password', hasPermission('edit_employees'), changeEmployeePassword);

module.exports = router;
