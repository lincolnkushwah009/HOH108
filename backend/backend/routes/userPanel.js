const express = require('express');
const router = express.Router();
const userPanelController = require('../controllers/userPanelController');
const { protect } = require('../middleware/auth');

// All routes require authentication
router.use(protect);

// Profile routes
router.get('/profile', userPanelController.getUserProfile);
router.put('/profile', userPanelController.updateUserProfile);

// Project routes
router.get('/projects', userPanelController.getUserProjects);
router.get('/projects/:id', userPanelController.getProjectDetails);

// KYC routes
router.get('/kyc', userPanelController.getKYCDetails);

// Designer routes
router.get('/designer', userPanelController.getDesignerDetails);

// Design routes
router.get('/designs', userPanelController.getDesigns);
router.get('/designs/:id', userPanelController.getDesignDetails);
router.put('/designs/:id/approve', userPanelController.approveDesign);
router.put('/designs/:id/reject', userPanelController.rejectDesign);
router.post('/designs/:id/comment', userPanelController.addDesignComment);

module.exports = router;
