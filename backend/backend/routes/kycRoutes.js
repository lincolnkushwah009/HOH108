const express = require('express');
const router = express.Router();
const {
  uploadKYCDocuments,
  getKYCStatus,
  getPendingKYC,
  getAllKYC,
  verifyKYC,
  rejectKYC,
  getCustomerKYC,
  deleteKYCDocument
} = require('../controllers/kycController');
const { protect, authorize } = require('../middleware/auth');
const { kycUpload } = require('../middleware/upload');

// Customer routes
router.post('/upload', protect, kycUpload, uploadKYCDocuments);
router.get('/status', protect, getKYCStatus);
router.delete('/document/:documentId', protect, deleteKYCDocument);

// Admin routes
router.get('/pending', protect, authorize('admin', 'super_admin', 'interior_admin', 'construction_admin', 'renovation_admin', 'on_demand_admin'), getPendingKYC);
router.get('/all', protect, authorize('admin', 'super_admin', 'interior_admin', 'construction_admin', 'renovation_admin', 'on_demand_admin'), getAllKYC);
router.get('/customer/:userId', protect, authorize('admin', 'super_admin', 'interior_admin', 'construction_admin', 'renovation_admin', 'on_demand_admin'), getCustomerKYC);
router.put('/verify/:userId', protect, authorize('admin', 'super_admin', 'interior_admin', 'construction_admin', 'renovation_admin', 'on_demand_admin'), verifyKYC);
router.put('/reject/:userId', protect, authorize('admin', 'super_admin', 'interior_admin', 'construction_admin', 'renovation_admin', 'on_demand_admin'), rejectKYC);

module.exports = router;
