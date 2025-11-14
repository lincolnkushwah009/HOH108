const express = require('express');
const router = express.Router();
const customerController = require('../controllers/customerController');
const { protect } = require('../middleware/auth');
const { authorize } = require('../middleware/auth');

// Protect all routes and authorize for admin/super_admin/manager/designer/crm
router.use(protect);
router.use(authorize('admin', 'super_admin', 'interior_admin', 'construction_admin', 'renovation_admin', 'on_demand_admin', 'manager', 'designer', 'crm'));

// Statistics route (must be before :id route)
router.get('/stats', customerController.getCustomerStats);

// CRUD routes
router.get('/', customerController.getAllCustomers);
router.post('/', customerController.createCustomer);
router.get('/:id', customerController.getCustomer);
router.put('/:id', customerController.updateCustomer);
router.delete('/:id', customerController.deleteCustomer);

// Assignment routes
router.put('/:id/assign-crm', customerController.assignCRM);
router.put('/:id/assign-designer', customerController.assignDesigner);

module.exports = router;
