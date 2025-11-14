const express = require('express');
const router = express.Router();
const Lead = require('../models/Lead');

/**
 * POST /api/leads
 * Purpose: Store a new lead inquiry in the database
 * Request Body:
 *   General Lead: { name, email, city, carpetArea, estimatedCost }
 *   Cost Estimate Lead: { name, email, phone, bhk, package, estimatedCost, leadType }
 * Returns: Success message with created lead data
 */
router.post('/', async (req, res) => {
  try {
    const { name, email, phone, city, carpetArea, bhk, package: pkg, estimatedCost, leadType } = req.body;

    // Validate required fields (name and email are always required)
    if (!name || !email) {
      return res.status(400).json({
        success: false,
        message: 'Name and email are required'
      });
    }

    // Create lead data object with all fields
    const leadData = {
      name,
      email,
      phone,
      city,
      carpetArea,
      bhk,
      package: pkg,
      estimatedCost,
      leadType: leadType || 'general'
    };

    // Create a new lead document
    const newLead = new Lead(leadData);

    // Save the document to the MongoDB leads collection
    const savedLead = await newLead.save();

    res.status(201).json({
      success: true,
      message: 'Lead inquiry saved successfully',
      data: savedLead
    });
  } catch (error) {
    console.error('Error saving lead:', error);

    // Handle validation errors
    if (error.name === 'ValidationError') {
      return res.status(400).json({
        success: false,
        message: 'Validation error',
        errors: Object.values(error.errors).map(err => err.message)
      });
    }

    res.status(500).json({
      success: false,
      message: 'Failed to save lead inquiry',
      error: error.message
    });
  }
});

module.exports = router;
