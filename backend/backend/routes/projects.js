const express = require('express');
const router = express.Router();
const projectController = require('../controllers/projectController');
const { protect } = require('../middleware/auth');
const { authorize } = require('../middleware/auth');

// Protect all routes and authorize for admin/super_admin/manager/designer/crm
router.use(protect);
router.use(authorize('admin', 'super_admin', 'interior_admin', 'construction_admin', 'renovation_admin', 'on_demand_admin', 'manager', 'designer', 'crm'));

// Statistics route (must be before :id route)
router.get('/stats', projectController.getProjectStats);

// CRUD routes
router.get('/', projectController.getAllProjects);
router.post('/', projectController.createProject);
router.get('/:id', projectController.getProject);
router.put('/:id', projectController.updateProject);
router.delete('/:id', projectController.deleteProject);

// Milestone routes
router.post('/:id/milestones', projectController.addMilestone);

module.exports = router;
