const express = require('express');
const router = express.Router();
const paymentController = require('../controllers/paymentController');
const { protect, authorize } = require('../middleware/auth');

// Protect all routes and authorize for admin/super_admin/manager/designer/crm
router.use(protect);
router.use(authorize('admin', 'super_admin', 'interior_admin', 'construction_admin', 'renovation_admin', 'on_demand_admin', 'manager', 'crm'));

// Statistics route (must be before :id route)
router.get('/stats', paymentController.getPaymentStats);

// Overdue payments route
router.get('/overdue', paymentController.getOverduePayments);

// Export route (must be before :id route)
router.get('/export', paymentController.exportPayments);

// CRUD routes
router.get('/', paymentController.getAllPayments);
router.post('/', paymentController.createPayment);
router.get('/:id', paymentController.getPayment);
router.put('/:id', paymentController.updatePayment);
router.delete('/:id', paymentController.deletePayment);

// Mark as paid route
router.put('/:id/mark-paid', paymentController.markAsPaid);

module.exports = router;
