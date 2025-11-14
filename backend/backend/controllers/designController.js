const Project = require('../models/Project');
const path = require('path');
const fs = require('fs');

// @desc    Upload design images for a project
// @route   POST /api/admin/designs/upload
// @access  Private (Designer only)
exports.uploadDesignImages = async (req, res) => {
  try {
    const { projectId, customerName, description } = req.body;

    if (!projectId) {
      return res.status(400).json({
        success: false,
        message: 'Project ID is required'
      });
    }

    if (!req.files || req.files.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'No images uploaded'
      });
    }

    // Find the project
    const project = await Project.findById(projectId);

    if (!project) {
      return res.status(404).json({
        success: false,
        message: 'Project not found'
      });
    }

    // Prepare image data
    const images = req.files.map(file => ({
      filename: file.filename,
      originalName: file.originalname,
      path: file.path,
      relativePath: `/uploads/design_images/${customerName}/${file.filename}`,
      size: file.size,
      uploadedBy: req.user._id,
      uploadedAt: new Date(),
      description: description || ''
    }));

    // Add images to project
    if (!project.designImages) {
      project.designImages = [];
    }
    project.designImages.push(...images);

    await project.save();

    res.status(200).json({
      success: true,
      message: `${images.length} image(s) uploaded successfully`,
      data: images
    });

  } catch (error) {
    console.error('Upload design images error:', error);
    res.status(500).json({
      success: false,
      message: 'Error uploading design images',
      error: error.message
    });
  }
};

// @desc    Get all design images for a project
// @route   GET /api/admin/designs/:projectId
// @access  Private
exports.getProjectDesignImages = async (req, res) => {
  try {
    const { projectId } = req.params;

    const project = await Project.findById(projectId)
      .populate('customer', 'fullName customerId')
      .select('designImages title projectId');

    if (!project) {
      return res.status(404).json({
        success: false,
        message: 'Project not found'
      });
    }

    res.status(200).json({
      success: true,
      data: {
        projectId: project.projectId,
        projectTitle: project.title,
        customer: project.customer,
        images: project.designImages || []
      }
    });

  } catch (error) {
    console.error('Get design images error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching design images',
      error: error.message
    });
  }
};

// @desc    Delete a design image
// @route   DELETE /api/admin/designs/:projectId/image/:imageId
// @access  Private (Designer/Admin only)
exports.deleteDesignImage = async (req, res) => {
  try {
    const { projectId, imageId } = req.params;

    const project = await Project.findById(projectId);

    if (!project) {
      return res.status(404).json({
        success: false,
        message: 'Project not found'
      });
    }

    // Find the image
    const imageIndex = project.designImages.findIndex(
      img => img._id.toString() === imageId
    );

    if (imageIndex === -1) {
      return res.status(404).json({
        success: false,
        message: 'Image not found'
      });
    }

    const image = project.designImages[imageIndex];

    // Delete file from filesystem
    if (fs.existsSync(image.path)) {
      fs.unlinkSync(image.path);
    }

    // Remove from project
    project.designImages.splice(imageIndex, 1);
    await project.save();

    res.status(200).json({
      success: true,
      message: 'Design image deleted successfully'
    });

  } catch (error) {
    console.error('Delete design image error:', error);
    res.status(500).json({
      success: false,
      message: 'Error deleting design image',
      error: error.message
    });
  }
};
