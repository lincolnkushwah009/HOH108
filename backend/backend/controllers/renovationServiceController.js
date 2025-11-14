const RenovationService = require('../models/RenovationService');

// Get all renovation services (public)
exports.getAllServices = async (req, res) => {
  try {
    const { category, search, popular, active } = req.query;

    let query = { active: true };

    if (category && category !== 'All') {
      query.category = category;
    }

    if (popular === 'true') {
      query.popular = true;
    }

    if (active !== undefined) {
      query.active = active === 'true';
    }

    if (search) {
      query.$text = { $search: search };
    }

    const services = await RenovationService.find(query)
      .sort({ popular: -1, totalBookings: -1, createdAt: -1 })
      .select('-__v');

    res.status(200).json({
      success: true,
      data: services
    });
  } catch (error) {
    console.error('Error fetching renovation services:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch renovation services',
      error: error.message
    });
  }
};

// Get single renovation service by ID (public)
exports.getServiceById = async (req, res) => {
  try {
    const service = await RenovationService.findById(req.params.id);

    if (!service) {
      return res.status(404).json({
        success: false,
        message: 'Renovation service not found'
      });
    }

    res.status(200).json({
      success: true,
      data: service
    });
  } catch (error) {
    console.error('Error fetching renovation service:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch renovation service',
      error: error.message
    });
  }
};

// Admin: Get all renovation services (including inactive)
exports.adminGetAllServices = async (req, res) => {
  try {
    const { category, search, popular, active } = req.query;

    let query = {};

    if (category && category !== 'All') {
      query.category = category;
    }

    if (popular !== undefined) {
      query.popular = popular === 'true';
    }

    if (active !== undefined) {
      query.active = active === 'true';
    }

    if (search) {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
        { category: { $regex: search, $options: 'i' } }
      ];
    }

    const services = await RenovationService.find(query)
      .sort({ createdAt: -1 })
      .populate('createdBy', 'name email')
      .populate('lastModifiedBy', 'name email');

    res.status(200).json({
      success: true,
      data: services
    });
  } catch (error) {
    console.error('Error fetching renovation services:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch renovation services',
      error: error.message
    });
  }
};

// Admin: Create renovation service
exports.createService = async (req, res) => {
  try {
    const serviceData = {
      ...req.body,
      createdBy: req.user._id,
      lastModifiedBy: req.user._id
    };

    const service = await RenovationService.create(serviceData);

    res.status(201).json({
      success: true,
      message: 'Renovation service created successfully',
      data: service
    });
  } catch (error) {
    console.error('Error creating renovation service:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to create renovation service',
      error: error.message
    });
  }
};

// Admin: Update renovation service
exports.updateService = async (req, res) => {
  try {
    const service = await RenovationService.findById(req.params.id);

    if (!service) {
      return res.status(404).json({
        success: false,
        message: 'Renovation service not found'
      });
    }

    // Update fields
    Object.keys(req.body).forEach(key => {
      service[key] = req.body[key];
    });

    service.lastModifiedBy = req.user._id;
    await service.save();

    res.status(200).json({
      success: true,
      message: 'Renovation service updated successfully',
      data: service
    });
  } catch (error) {
    console.error('Error updating renovation service:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update renovation service',
      error: error.message
    });
  }
};

// Admin: Delete renovation service
exports.deleteService = async (req, res) => {
  try {
    const service = await RenovationService.findById(req.params.id);

    if (!service) {
      return res.status(404).json({
        success: false,
        message: 'Renovation service not found'
      });
    }

    await service.deleteOne();

    res.status(200).json({
      success: true,
      message: 'Renovation service deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting renovation service:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to delete renovation service',
      error: error.message
    });
  }
};

// Admin: Toggle active status
exports.toggleActive = async (req, res) => {
  try {
    const service = await RenovationService.findById(req.params.id);

    if (!service) {
      return res.status(404).json({
        success: false,
        message: 'Renovation service not found'
      });
    }

    service.active = !service.active;
    service.lastModifiedBy = req.user._id;
    await service.save();

    res.status(200).json({
      success: true,
      message: `Renovation service ${service.active ? 'activated' : 'deactivated'} successfully`,
      data: service
    });
  } catch (error) {
    console.error('Error toggling service status:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to toggle service status',
      error: error.message
    });
  }
};

// Admin: Toggle popular status
exports.togglePopular = async (req, res) => {
  try {
    const service = await RenovationService.findById(req.params.id);

    if (!service) {
      return res.status(404).json({
        success: false,
        message: 'Renovation service not found'
      });
    }

    service.popular = !service.popular;
    service.lastModifiedBy = req.user._id;
    await service.save();

    res.status(200).json({
      success: true,
      message: `Renovation service ${service.popular ? 'marked as popular' : 'unmarked from popular'} successfully`,
      data: service
    });
  } catch (error) {
    console.error('Error toggling popular status:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to toggle popular status',
      error: error.message
    });
  }
};

// Admin: Get renovation service statistics
exports.getServiceStats = async (req, res) => {
  try {
    const totalServices = await RenovationService.countDocuments();
    const activeServices = await RenovationService.countDocuments({ active: true });
    const inactiveServices = await RenovationService.countDocuments({ active: false });
    const popularServices = await RenovationService.countDocuments({ popular: true });

    const totalBookings = await RenovationService.aggregate([
      { $group: { _id: null, total: { $sum: '$totalBookings' } } }
    ]);

    const servicesByCategory = await RenovationService.aggregate([
      { $group: { _id: '$category', count: { $sum: 1 } } },
      { $sort: { count: -1 } }
    ]);

    const topServices = await RenovationService.find({ active: true })
      .sort({ totalBookings: -1 })
      .limit(5)
      .select('title category totalBookings rating');

    res.status(200).json({
      success: true,
      data: {
        totalServices,
        activeServices,
        inactiveServices,
        popularServices,
        totalBookings: totalBookings[0]?.total || 0,
        servicesByCategory,
        topServices
      }
    });
  } catch (error) {
    console.error('Error fetching service stats:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch service statistics',
      error: error.message
    });
  }
};
