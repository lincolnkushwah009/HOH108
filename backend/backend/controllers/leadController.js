const Lead = require('../models/Lead');
const { getServiceTypeFilter } = require('../utils/serviceTypeFilter');

// @desc    Get all leads
// @route   GET /api/admin/leads
// @access  Private/Admin
exports.getAllLeads = async (req, res) => {
  try {
    const { page = 1, limit = 10, search, status, sortBy = 'createdAt', order = 'desc', serviceType } = req.query;

    // Build query
    let query = {};

    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } },
        { city: { $regex: search, $options: 'i' } }
      ];
    }

    if (status) query.status = status;

    // Add service type filter
    const serviceFilter = getServiceTypeFilter(req.user, serviceType);
    if (serviceFilter.serviceType) {
      query.serviceType = serviceFilter.serviceType;
    }

    // Build sort object
    const sortObject = {};
    sortObject[sortBy] = order === 'asc' ? 1 : -1;

    // Execute query with pagination
    const leads = await Lead.find(query)
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .sort(sortObject);

    const count = await Lead.countDocuments(query);

    res.json({
      success: true,
      data: leads,
      pagination: {
        total: count,
        page: parseInt(page),
        pages: Math.ceil(count / limit),
        limit: parseInt(limit)
      }
    });
  } catch (error) {
    console.error('Get leads error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching leads',
      error: error.message
    });
  }
};

// @desc    Get single lead
// @route   GET /api/admin/leads/:id
// @access  Private/Admin
exports.getLead = async (req, res) => {
  try {
    const lead = await Lead.findById(req.params.id);

    if (!lead) {
      return res.status(404).json({
        success: false,
        message: 'Lead not found'
      });
    }

    res.json({
      success: true,
      data: lead
    });
  } catch (error) {
    console.error('Get lead error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching lead',
      error: error.message
    });
  }
};

// @desc    Update lead
// @route   PUT /api/admin/leads/:id
// @access  Private/Admin
exports.updateLead = async (req, res) => {
  try {
    const lead = await Lead.findById(req.params.id);

    if (!lead) {
      return res.status(404).json({
        success: false,
        message: 'Lead not found'
      });
    }

    // Track changes
    const changes = {};
    const historyEntry = {
      action: 'updated',
      description: '',
      changedBy: req.user?._id,
      changedByName: req.user?.name || 'Admin User',
      timestamp: new Date(),
      changes: {}
    };

    // Check what fields changed
    const fieldsToTrack = ['name', 'email', 'city', 'carpetArea', 'estimatedCost', 'status', 'notes'];
    let changesDescription = [];

    fieldsToTrack.forEach(field => {
      if (req.body[field] !== undefined && req.body[field] !== lead[field]) {
        changes[field] = {
          from: lead[field],
          to: req.body[field]
        };

        if (field === 'status') {
          changesDescription.push(`Status changed from "${lead[field]}" to "${req.body[field]}"`);
        } else if (field === 'notes') {
          changesDescription.push('Notes updated');
        } else {
          changesDescription.push(`${field.charAt(0).toUpperCase() + field.slice(1)} updated`);
        }
      }
    });

    historyEntry.description = changesDescription.length > 0
      ? changesDescription.join(', ')
      : 'Lead information updated';
    historyEntry.changes = changes;

    // Add to history if there are changes
    if (Object.keys(changes).length > 0) {
      if (!lead.history) {
        lead.history = [];
      }
      lead.history.push(historyEntry);
    }

    // Update lead fields
    Object.keys(req.body).forEach(key => {
      if (fieldsToTrack.includes(key)) {
        lead[key] = req.body[key];
      }
    });

    // Update lastModifiedBy
    lead.lastModifiedBy = req.user?._id;

    await lead.save();

    res.json({
      success: true,
      data: lead,
      message: 'Lead updated successfully'
    });
  } catch (error) {
    console.error('Update lead error:', error);
    res.status(400).json({
      success: false,
      message: 'Error updating lead',
      error: error.message
    });
  }
};

// @desc    Delete lead
// @route   DELETE /api/admin/leads/:id
// @access  Private/Admin
exports.deleteLead = async (req, res) => {
  try {
    const lead = await Lead.findById(req.params.id);

    if (!lead) {
      return res.status(404).json({
        success: false,
        message: 'Lead not found'
      });
    }

    await Lead.findByIdAndDelete(req.params.id);

    res.json({
      success: true,
      message: 'Lead deleted successfully'
    });
  } catch (error) {
    console.error('Delete lead error:', error);
    res.status(500).json({
      success: false,
      message: 'Error deleting lead',
      error: error.message
    });
  }
};

// @desc    Get lead statistics
// @route   GET /api/admin/leads/stats
// @access  Private/Admin
exports.getLeadStats = async (req, res) => {
  try {
    const { serviceType } = req.query;

    // Build base query with service type filter
    let baseQuery = {};
    const serviceFilter = getServiceTypeFilter(req.user, serviceType);
    if (serviceFilter.serviceType) {
      baseQuery.serviceType = serviceFilter.serviceType;
    }

    const totalLeads = await Lead.countDocuments(baseQuery);

    // Get leads from last 30 days
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    const recentLeads = await Lead.countDocuments({
      ...baseQuery,
      createdAt: { $gte: thirtyDaysAgo }
    });

    // Get leads by city (with service type filter)
    const cityPipeline = [];
    if (baseQuery.serviceType) {
      cityPipeline.push({ $match: { serviceType: baseQuery.serviceType } });
    }
    cityPipeline.push(
      { $group: { _id: '$city', count: { $sum: 1 } } },
      { $sort: { count: -1 } },
      { $limit: 10 }
    );
    const leadsByCity = await Lead.aggregate(cityPipeline);

    // Calculate average estimated cost (with service type filter)
    const costPipeline = [];
    if (baseQuery.serviceType) {
      costPipeline.push({ $match: { serviceType: baseQuery.serviceType } });
    }
    costPipeline.push({ $group: { _id: null, avgCost: { $avg: '$estimatedCost' } } });
    const avgCostResult = await Lead.aggregate(costPipeline);
    const avgEstimatedCost = avgCostResult.length > 0 ? avgCostResult[0].avgCost : 0;

    // Calculate average carpet area (with service type filter)
    const areaPipeline = [];
    if (baseQuery.serviceType) {
      areaPipeline.push({ $match: { serviceType: baseQuery.serviceType } });
    }
    areaPipeline.push({ $group: { _id: null, avgArea: { $avg: '$carpetArea' } } });
    const avgAreaResult = await Lead.aggregate(areaPipeline);
    const avgCarpetArea = avgAreaResult.length > 0 ? avgAreaResult[0].avgArea : 0;

    res.json({
      success: true,
      data: {
        total: totalLeads,
        recent: recentLeads,
        byCity: leadsByCity,
        avgEstimatedCost: Math.round(avgEstimatedCost),
        avgCarpetArea: Math.round(avgCarpetArea)
      }
    });
  } catch (error) {
    console.error('Get lead stats error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching statistics',
      error: error.message
    });
  }
};
