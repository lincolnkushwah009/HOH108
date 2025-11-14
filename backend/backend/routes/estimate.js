const express = require('express');
const router = express.Router();

/**
 * City-based cost multipliers
 * These represent the relative cost of interior work in different cities
 * Tier 1 cities have higher costs due to labor and material expenses
 */
const CITY_MULTIPLIERS = {
  // Tier 1 Cities (Metro)
  'mumbai': 1.5,
  'delhi': 1.4,
  'bangalore': 1.45,
  'bengaluru': 1.45,
  'hyderabad': 1.3,
  'chennai': 1.3,
  'kolkata': 1.25,
  'pune': 1.35,

  // Tier 2 Cities
  'ahmedabad': 1.2,
  'jaipur': 1.15,
  'lucknow': 1.1,
  'kochi': 1.2,
  'chandigarh': 1.15,
  'indore': 1.1,

  // Default for other cities
  'default': 1.0
};

// Base cost per square foot in INR
const BASE_COST_PER_SQ_FT = 1500;

/**
 * POST /api/estimate
 * Purpose: Calculate a renovation cost estimate
 * Request Body: { carpetArea: Number, city: String }
 * Returns: { estimatedCost: Number }
 */
router.post('/', async (req, res) => {
  try {
    const { carpetArea, city } = req.body;

    // Validate input
    if (!carpetArea || !city) {
      return res.status(400).json({
        success: false,
        message: 'Both carpetArea and city are required'
      });
    }

    if (carpetArea <= 0) {
      return res.status(400).json({
        success: false,
        message: 'Carpet area must be greater than 0'
      });
    }

    // Get city multiplier (case-insensitive)
    const cityLower = city.toLowerCase().trim();
    const cityMultiplier = CITY_MULTIPLIERS[cityLower] || CITY_MULTIPLIERS['default'];

    // Calculate estimated cost
    // Formula: Base Cost per sq ft × Carpet Area × City Multiplier
    const estimatedCost = Math.round(BASE_COST_PER_SQ_FT * carpetArea * cityMultiplier);

    res.status(200).json({
      success: true,
      data: {
        carpetArea,
        city,
        cityMultiplier,
        baseCostPerSqFt: BASE_COST_PER_SQ_FT,
        estimatedCost
      }
    });
  } catch (error) {
    console.error('Error calculating estimate:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to calculate estimate',
      error: error.message
    });
  }
});

module.exports = router;
