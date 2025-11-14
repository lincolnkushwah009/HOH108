const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth');
const upload = require('../middleware/upload');
const {
  uploadDesignImages,
  getProjectDesignImages,
  deleteDesignImage
} = require('../controllers/designController');

// Upload design images (multiple files)
router.post('/upload', protect, upload.array('images', 10), uploadDesignImages);

// Get all design images for a project
router.get('/:projectId', protect, getProjectDesignImages);

// Delete a specific design image
router.delete('/:projectId/image/:imageId', protect, deleteDesignImage);

module.exports = router;
