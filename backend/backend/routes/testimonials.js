const express = require('express');
const router = express.Router();
const Testimonial = require('../models/Testimonial');

/**
 * GET /api/testimonials
 * Purpose: Fetch all client testimonials
 * Returns: Array of all testimonials
 */
router.get('/', async (req, res) => {
  try {
    // Query the testimonials collection and return all documents
    const testimonials = await Testimonial.find({}).sort({ createdAt: -1 }); // Sort by newest first

    res.status(200).json({
      success: true,
      count: testimonials.length,
      data: testimonials
    });
  } catch (error) {
    console.error('Error fetching testimonials:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch testimonials',
      error: error.message
    });
  }
});

module.exports = router;
