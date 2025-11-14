const ServiceProvider = require('../models/ServiceProvider');
const OnDemandService = require('../models/OnDemandService');

// @desc    Get all service providers
// @route   GET /api/admin/on-demand/providers
// @access  Private/Admin
exports.getAllProviders = async (req, res) => {
  try {
    const { page = 1, limit = 10, search, status, city, service } = req.query;

    // Build query
    let query = {};

    if (search) {
      query.$text = { $search: search };
    }

    if (status) {
      query.status = status;
    }

    if (city) {
      query['address.city'] = { $regex: city, $options: 'i' };
    }

    if (service) {
      query['services.service'] = service;
    }

    // Execute query with pagination
    const providers = await ServiceProvider.find(query)
      .populate('services.service', 'title category')
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .sort({ createdAt: -1 });

    const count = await ServiceProvider.countDocuments(query);

    res.json({
      success: true,
      data: providers,
      pagination: {
        total: count,
        page: parseInt(page),
        pages: Math.ceil(count / limit),
        limit: parseInt(limit)
      }
    });
  } catch (error) {
    console.error('Get providers error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching providers',
      error: error.message
    });
  }
};

// @desc    Get single provider
// @route   GET /api/admin/on-demand/providers/:id
// @access  Private/Admin
exports.getProvider = async (req, res) => {
  try {
    const provider = await ServiceProvider.findById(req.params.id)
      .populate('services.service', 'title category')
      .populate('reviews.booking');

    if (!provider) {
      return res.status(404).json({
        success: false,
        message: 'Provider not found'
      });
    }

    res.json({
      success: true,
      data: provider
    });
  } catch (error) {
    console.error('Get provider error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching provider',
      error: error.message
    });
  }
};

// @desc    Create new provider
// @route   POST /api/admin/on-demand/providers
// @access  Private/Admin
exports.createProvider = async (req, res) => {
  try {
    const {
      fullName,
      email,
      phone,
      alternatePhone,
      profileImage,
      address,
      serviceAreas,
      services,
      skills,
      experience,
      certifications,
      documents,
      availability,
      bankDetails,
      status
    } = req.body;

    // Check if provider with same email exists
    const existingProvider = await ServiceProvider.findOne({ email });

    if (existingProvider) {
      return res.status(400).json({
        success: false,
        message: 'Provider with this email already exists'
      });
    }

    // Create provider
    const provider = await ServiceProvider.create({
      fullName,
      email,
      phone,
      alternatePhone,
      profileImage,
      address,
      serviceAreas,
      services,
      skills,
      experience,
      certifications,
      documents,
      availability,
      bankDetails,
      status: status || 'pending_verification',
      createdBy: req.user._id
    });

    // Add provider to service's serviceProviders array
    if (services && services.length > 0) {
      for (const svc of services) {
        await OnDemandService.findByIdAndUpdate(
          svc.service,
          { $addToSet: { serviceProviders: provider._id } }
        );
      }
    }

    res.status(201).json({
      success: true,
      data: provider,
      message: 'Provider created successfully'
    });
  } catch (error) {
    console.error('Create provider error:', error);
    res.status(400).json({
      success: false,
      message: 'Error creating provider',
      error: error.message
    });
  }
};

// @desc    Update provider
// @route   PUT /api/admin/on-demand/providers/:id
// @access  Private/Admin
exports.updateProvider = async (req, res) => {
  try {
    const provider = await ServiceProvider.findById(req.params.id);

    if (!provider) {
      return res.status(404).json({
        success: false,
        message: 'Provider not found'
      });
    }

    // If services are being updated, update the OnDemandService references
    if (req.body.services) {
      // Remove provider from old services
      for (const svc of provider.services) {
        await OnDemandService.findByIdAndUpdate(
          svc.service,
          { $pull: { serviceProviders: provider._id } }
        );
      }

      // Add provider to new services
      for (const svc of req.body.services) {
        await OnDemandService.findByIdAndUpdate(
          svc.service,
          { $addToSet: { serviceProviders: provider._id } }
        );
      }
    }

    // Update provider
    const updatedProvider = await ServiceProvider.findByIdAndUpdate(
      req.params.id,
      { ...req.body, lastModifiedBy: req.user._id },
      {
        new: true,
        runValidators: true
      }
    );

    res.json({
      success: true,
      data: updatedProvider,
      message: 'Provider updated successfully'
    });
  } catch (error) {
    console.error('Update provider error:', error);
    res.status(400).json({
      success: false,
      message: 'Error updating provider',
      error: error.message
    });
  }
};

// @desc    Delete provider
// @route   DELETE /api/admin/on-demand/providers/:id
// @access  Private/Admin
exports.deleteProvider = async (req, res) => {
  try {
    const provider = await ServiceProvider.findById(req.params.id);

    if (!provider) {
      return res.status(404).json({
        success: false,
        message: 'Provider not found'
      });
    }

    // Remove provider from all services
    for (const svc of provider.services) {
      await OnDemandService.findByIdAndUpdate(
        svc.service,
        { $pull: { serviceProviders: provider._id } }
      );
    }

    await ServiceProvider.findByIdAndDelete(req.params.id);

    res.json({
      success: true,
      message: 'Provider deleted successfully'
    });
  } catch (error) {
    console.error('Delete provider error:', error);
    res.status(500).json({
      success: false,
      message: 'Error deleting provider',
      error: error.message
    });
  }
};

// @desc    Get available providers for a service
// @route   GET /api/on-demand/providers/available/:serviceId
// @access  Public
exports.getAvailableProviders = async (req, res) => {
  try {
    const { city, pincode, date } = req.query;

    let query = {
      'services.service': req.params.serviceId,
      status: 'active',
      'availability.status': 'available'
    };

    if (city) {
      query['address.city'] = { $regex: city, $options: 'i' };
    }

    if (pincode) {
      query['serviceAreas.pincodes'] = pincode;
    }

    const providers = await ServiceProvider.find(query)
      .select('fullName profileImage rating services experience availability')
      .populate('services.service', 'title')
      .sort({ 'rating.average': -1 });

    // Filter by date if provided
    let availableProviders = providers;
    if (date) {
      const requestedDate = new Date(date);
      const dayOfWeek = requestedDate.toLocaleDateString('en-US', { weekday: 'long' });

      availableProviders = providers.filter(provider => {
        // Check if provider works on this day
        if (!provider.availability.workingDays.includes(dayOfWeek)) {
          return false;
        }

        // Check if provider is on leave
        const isOnLeave = provider.availability.unavailableDates.some(unavailable => {
          return requestedDate >= unavailable.from && requestedDate <= unavailable.to;
        });

        return !isOnLeave;
      });
    }

    res.json({
      success: true,
      data: availableProviders,
      count: availableProviders.length
    });
  } catch (error) {
    console.error('Get available providers error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching available providers',
      error: error.message
    });
  }
};

// @desc    Update provider status
// @route   PUT /api/admin/on-demand/providers/:id/status
// @access  Private/Admin
exports.updateProviderStatus = async (req, res) => {
  try {
    const { status } = req.body;

    const validStatuses = ['pending_verification', 'active', 'inactive', 'suspended', 'blacklisted'];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid status value'
      });
    }

    const provider = await ServiceProvider.findByIdAndUpdate(
      req.params.id,
      { status, lastModifiedBy: req.user._id },
      { new: true }
    );

    if (!provider) {
      return res.status(404).json({
        success: false,
        message: 'Provider not found'
      });
    }

    res.json({
      success: true,
      data: provider,
      message: 'Provider status updated successfully'
    });
  } catch (error) {
    console.error('Update provider status error:', error);
    res.status(400).json({
      success: false,
      message: 'Error updating provider status',
      error: error.message
    });
  }
};

// @desc    Verify provider documents
// @route   PUT /api/admin/on-demand/providers/:id/verify-documents
// @access  Private/Admin
exports.verifyDocuments = async (req, res) => {
  try {
    const { documentType, verified } = req.body;

    const provider = await ServiceProvider.findById(req.params.id);

    if (!provider) {
      return res.status(404).json({
        success: false,
        message: 'Provider not found'
      });
    }

    if (documentType && provider.documents[documentType]) {
      provider.documents[documentType].verified = verified;
    }

    // Check if all required documents are verified
    const allVerified =
      provider.documents.aadharCard?.verified &&
      provider.documents.panCard?.verified &&
      provider.documents.policeClearance?.verified;

    if (allVerified) {
      provider.verified.documents = true;
      provider.verified.background = true;
    }

    provider.lastModifiedBy = req.user._id;
    await provider.save();

    res.json({
      success: true,
      data: provider,
      message: 'Document verification updated successfully'
    });
  } catch (error) {
    console.error('Verify documents error:', error);
    res.status(400).json({
      success: false,
      message: 'Error verifying documents',
      error: error.message
    });
  }
};

// @desc    Update provider availability
// @route   PUT /api/admin/on-demand/providers/:id/availability
// @access  Private/Admin
exports.updateAvailability = async (req, res) => {
  try {
    const { availability } = req.body;

    const provider = await ServiceProvider.findByIdAndUpdate(
      req.params.id,
      { availability, lastModifiedBy: req.user._id },
      { new: true }
    );

    if (!provider) {
      return res.status(404).json({
        success: false,
        message: 'Provider not found'
      });
    }

    res.json({
      success: true,
      data: provider,
      message: 'Availability updated successfully'
    });
  } catch (error) {
    console.error('Update availability error:', error);
    res.status(400).json({
      success: false,
      message: 'Error updating availability',
      error: error.message
    });
  }
};

// @desc    Get provider statistics
// @route   GET /api/admin/on-demand/providers/stats
// @access  Private/Admin
exports.getProviderStats = async (req, res) => {
  try {
    const totalProviders = await ServiceProvider.countDocuments();
    const activeProviders = await ServiceProvider.countDocuments({ status: 'active' });
    const pendingVerification = await ServiceProvider.countDocuments({ status: 'pending_verification' });
    const suspendedProviders = await ServiceProvider.countDocuments({ status: 'suspended' });

    const providersByCity = await ServiceProvider.aggregate([
      { $group: { _id: '$address.city', count: { $sum: 1 } } }
    ]);

    const topRatedProviders = await ServiceProvider.find({ status: 'active' })
      .select('fullName rating performance.completedBookings')
      .sort({ 'rating.average': -1 })
      .limit(5);

    const topPerformingProviders = await ServiceProvider.find({ status: 'active' })
      .select('fullName performance.completedBookings performance.completionRate rating.average')
      .sort({ 'performance.completedBookings': -1 })
      .limit(5);

    res.json({
      success: true,
      data: {
        total: totalProviders,
        active: activeProviders,
        pendingVerification,
        suspended: suspendedProviders,
        byCity: providersByCity,
        topRated: topRatedProviders,
        topPerforming: topPerformingProviders
      }
    });
  } catch (error) {
    console.error('Get provider stats error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching statistics',
      error: error.message
    });
  }
};

// @desc    Add review to provider
// @route   POST /api/on-demand/providers/:id/review
// @access  Private
exports.addReview = async (req, res) => {
  try {
    const { rating, review, bookingId, customerName, customerEmail } = req.body;

    const provider = await ServiceProvider.findById(req.params.id);

    if (!provider) {
      return res.status(404).json({
        success: false,
        message: 'Provider not found'
      });
    }

    // Add review
    provider.reviews.push({
      customer: { name: customerName, email: customerEmail },
      booking: bookingId,
      rating,
      review
    });

    // Update rating
    const newCount = provider.rating.count + 1;
    const newAverage = ((provider.rating.average * provider.rating.count) + rating) / newCount;
    provider.rating.average = newAverage;
    provider.rating.count = newCount;

    await provider.save();

    res.json({
      success: true,
      data: provider,
      message: 'Review added successfully'
    });
  } catch (error) {
    console.error('Add review error:', error);
    res.status(400).json({
      success: false,
      message: 'Error adding review',
      error: error.message
    });
  }
};

// @desc    Get provider's own bookings
// @route   GET /api/on-demand/providers/my-bookings
// @access  Private (Service Provider)
exports.getMyBookings = async (req, res) => {
  try {
    const OnDemandBooking = require('../models/OnDemandBooking');
    const { page = 1, limit = 20, status, date } = req.query;

    // Build query - filter by provider ID from authenticated user
    const providerId = req.user._id || req.user.id;
    let query = { serviceProvider: providerId };

    // Filter by status if provided
    if (status) {
      const statusArray = status.split(',');
      query.status = { $in: statusArray };
    }

    // Filter by date if provided
    if (date) {
      const startDate = new Date(date);
      startDate.setHours(0, 0, 0, 0);
      const endDate = new Date(date);
      endDate.setHours(23, 59, 59, 999);
      query.scheduledDate = { $gte: startDate, $lte: endDate };
    }

    // Fetch bookings with pagination
    const bookings = await OnDemandBooking.find(query)
      .populate('service', 'title category pricing image')
      .populate('customer.userId', 'fullName email phone')
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .sort({ scheduledDate: 1, createdAt: -1 });

    const count = await OnDemandBooking.countDocuments(query);

    res.json({
      success: true,
      data: bookings,
      pagination: {
        total: count,
        page: parseInt(page),
        pages: Math.ceil(count / limit),
        limit: parseInt(limit)
      }
    });
  } catch (error) {
    console.error('Get provider bookings error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching bookings',
      error: error.message
    });
  }
};
