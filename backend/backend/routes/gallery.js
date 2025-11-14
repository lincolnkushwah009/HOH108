const express = require('express');
const router = express.Router();
const Gallery = require('../models/Gallery');

/**
 * GET /api/gallery
 * Purpose: Fetch all projects for the design gallery
 * Returns: Array of all gallery items
 */
router.get('/', async (req, res) => {
  try {
    // Query the gallery collection and return all documents
    const galleryItems = await Gallery.find({}).sort({ createdAt: -1 }); // Sort by newest first

    res.status(200).json({
      success: true,
      count: galleryItems.length,
      data: galleryItems
    });
  } catch (error) {
    console.error('Error fetching gallery items:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch gallery items',
      error: error.message
    });
  }
});

module.exports = router;
