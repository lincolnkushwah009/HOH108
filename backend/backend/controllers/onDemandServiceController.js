const OnDemandService = require('../models/OnDemandService');

// @desc    Get all on-demand services
// @route   GET /api/on-demand/services
// @access  Public
exports.getAllServices = async (req, res) => {
  try {
    const { page = 1, limit = 10, search, category, popular, trending, active } = req.query;

    // Build query
    let query = {};

    if (search) {
      query.$text = { $search: search };
    }

    if (category) {
      query.category = category;
    }

    if (popular !== undefined) {
      query.popular = popular === 'true';
    }

    if (trending !== undefined) {
      query.trending = trending === 'true';
    }

    // Filter by active status if explicitly provided
    if (active !== undefined) {
      query.active = active === 'true';
    }
    // If active is not provided, show all services (no filter applied)

    // Execute query with pagination
    const services = await OnDemandService.find(query)
      .populate('serviceProviders', 'fullName rating.average status')
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .sort({ popular: -1, 'rating.average': -1, createdAt: -1 });

    const count = await OnDemandService.countDocuments(query);

    res.json({
      success: true,
      data: services,
      pagination: {
        total: count,
        page: parseInt(page),
        pages: Math.ceil(count / limit),
        limit: parseInt(limit)
      }
    });
  } catch (error) {
    console.error('Get services error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching services',
      error: error.message
    });
  }
};

// @desc    Get single service
// @route   GET /api/on-demand/services/:id
// @access  Public
exports.getService = async (req, res) => {
  try {
    const service = await OnDemandService.findById(req.params.id)
      .populate('serviceProviders', 'fullName rating.average experience.years status profileImage');

    if (!service) {
      return res.status(404).json({
        success: false,
        message: 'Service not found'
      });
    }

    res.json({
      success: true,
      data: service
    });
  } catch (error) {
    console.error('Get service error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching service',
      error: error.message
    });
  }
};

// @desc    Create new service
// @route   POST /api/admin/on-demand/services
// @access  Private/Admin
exports.createService = async (req, res) => {
  try {
    const {
      title,
      description,
      category,
      subcategory,
      image,
      images,
      pricing,
      duration,
      features,
      includedItems,
      excludedItems,
      requirements,
      availability,
      popular,
      trending,
      active,
      tags,
      seoMetadata
    } = req.body;

    // Create service
    const service = await OnDemandService.create({
      title,
      description,
      category,
      subcategory,
      image,
      images,
      pricing,
      duration,
      features,
      includedItems,
      excludedItems,
      requirements,
      availability,
      popular,
      trending,
      active,
      tags,
      seoMetadata,
      createdBy: req.user._id
    });

    res.status(201).json({
      success: true,
      data: service,
      message: 'Service created successfully'
    });
  } catch (error) {
    console.error('Create service error:', error);
    res.status(400).json({
      success: false,
      message: 'Error creating service',
      error: error.message
    });
  }
};

// @desc    Update service
// @route   PUT /api/admin/on-demand/services/:id
// @access  Private/Admin
exports.updateService = async (req, res) => {
  try {
    const service = await OnDemandService.findById(req.params.id);

    if (!service) {
      return res.status(404).json({
        success: false,
        message: 'Service not found'
      });
    }

    // Update service
    const updatedService = await OnDemandService.findByIdAndUpdate(
      req.params.id,
      { ...req.body, lastModifiedBy: req.user._id },
      {
        new: true,
        runValidators: true
      }
    );

    res.json({
      success: true,
      data: updatedService,
      message: 'Service updated successfully'
    });
  } catch (error) {
    console.error('Update service error:', error);
    res.status(400).json({
      success: false,
      message: 'Error updating service',
      error: error.message
    });
  }
};

// @desc    Delete service
// @route   DELETE /api/admin/on-demand/services/:id
// @access  Private/Admin
exports.deleteService = async (req, res) => {
  try {
    const service = await OnDemandService.findById(req.params.id);

    if (!service) {
      return res.status(404).json({
        success: false,
        message: 'Service not found'
      });
    }

    await OnDemandService.findByIdAndDelete(req.params.id);

    res.json({
      success: true,
      message: 'Service deleted successfully'
    });
  } catch (error) {
    console.error('Delete service error:', error);
    res.status(500).json({
      success: false,
      message: 'Error deleting service',
      error: error.message
    });
  }
};

// @desc    Get services by category
// @route   GET /api/on-demand/services/category/:category
// @access  Public
exports.getServicesByCategory = async (req, res) => {
  try {
    const services = await OnDemandService.find({
      category: req.params.category,
      active: true
    })
      .populate('serviceProviders', 'fullName rating.average')
      .sort({ popular: -1, 'rating.average': -1 });

    res.json({
      success: true,
      data: services,
      count: services.length
    });
  } catch (error) {
    console.error('Get services by category error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching services',
      error: error.message
    });
  }
};

// @desc    Get popular services
// @route   GET /api/on-demand/services/popular
// @access  Public
exports.getPopularServices = async (req, res) => {
  try {
    const limit = parseInt(req.query.limit) || 6;

    const services = await OnDemandService.find({
      popular: true,
      active: true
    })
      .populate('serviceProviders', 'fullName rating.average')
      .limit(limit)
      .sort({ totalBookings: -1, 'rating.average': -1 });

    res.json({
      success: true,
      data: services
    });
  } catch (error) {
    console.error('Get popular services error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching popular services',
      error: error.message
    });
  }
};

// @desc    Get service categories
// @route   GET /api/on-demand/categories
// @access  Public
exports.getCategories = async (req, res) => {
  try {
    const categories = await OnDemandService.distinct('category', { active: true });

    // Get count for each category
    const categoriesWithCount = await Promise.all(
      categories.map(async (category) => {
        const count = await OnDemandService.countDocuments({
          category,
          active: true
        });
        return { category, count };
      })
    );

    res.json({
      success: true,
      data: categoriesWithCount
    });
  } catch (error) {
    console.error('Get categories error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching categories',
      error: error.message
    });
  }
};

// @desc    Update service rating
// @route   POST /api/on-demand/services/:id/rating
// @access  Private
exports.updateServiceRating = async (req, res) => {
  try {
    const { rating } = req.body;

    const service = await OnDemandService.findById(req.params.id);

    if (!service) {
      return res.status(404).json({
        success: false,
        message: 'Service not found'
      });
    }

    // Calculate new average rating
    const newCount = service.rating.count + 1;
    const newAverage = ((service.rating.average * service.rating.count) + rating) / newCount;

    service.rating.average = newAverage;
    service.rating.count = newCount;

    await service.save();

    res.json({
      success: true,
      data: service,
      message: 'Rating updated successfully'
    });
  } catch (error) {
    console.error('Update rating error:', error);
    res.status(400).json({
      success: false,
      message: 'Error updating rating',
      error: error.message
    });
  }
};

// @desc    Get service statistics
// @route   GET /api/admin/on-demand/services/stats
// @access  Private/Admin
exports.getServiceStats = async (req, res) => {
  try {
    const totalServices = await OnDemandService.countDocuments();
    const activeServices = await OnDemandService.countDocuments({ active: true });
    const popularServices = await OnDemandService.countDocuments({ popular: true });
    const trendingServices = await OnDemandService.countDocuments({ trending: true });

    const servicesByCategory = await OnDemandService.aggregate([
      { $group: { _id: '$category', count: { $sum: 1 } } }
    ]);

    const topRatedServices = await OnDemandService.find({ active: true })
      .select('title category rating totalBookings')
      .sort({ 'rating.average': -1 })
      .limit(5);

    const mostBookedServices = await OnDemandService.find({ active: true })
      .select('title category totalBookings rating')
      .sort({ totalBookings: -1 })
      .limit(5);

    res.json({
      success: true,
      data: {
        total: totalServices,
        active: activeServices,
        popular: popularServices,
        trending: trendingServices,
        byCategory: servicesByCategory,
        topRated: topRatedServices,
        mostBooked: mostBookedServices
      }
    });
  } catch (error) {
    console.error('Get service stats error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching statistics',
      error: error.message
    });
  }
};
