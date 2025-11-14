const User = require('../models/User');
const Employee = require('../models/Employee');
const Project = require('../models/Project');
const Lead = require('../models/Lead');
const { getServiceTypeFilter, getUserServiceTypes } = require('../utils/serviceTypeFilter');

// @desc    Get dashboard statistics
// @route   GET /api/admin/dashboard/stats
// @access  Private/Admin
exports.getDashboardStats = async (req, res) => {
  try {
    const { serviceType } = req.query;
    const serviceFilter = getServiceTypeFilter(req.user, serviceType);

    // Get available service types for this user
    const availableServiceTypes = getUserServiceTypes(req.user);

    // Count total employees with service filter
    const totalEmployees = await Employee.countDocuments({
      status: { $ne: 'inactive' },
      ...serviceFilter
    });

    // Count total leads with service filter
    const totalLeads = await Lead.countDocuments(serviceFilter);

    // Count pending leads with service filter
    const pendingLeads = await Lead.countDocuments({
      status: { $in: ['new', 'rnr'] },
      ...serviceFilter
    });

    // Count total users (customers) with service filter
    const totalUsers = await User.countDocuments({
      role: 'user',
      ...serviceFilter
    });

    // Count total projects with service filter
    const totalProjects = await Project.countDocuments(serviceFilter);

    // Count active projects with service filter
    const activeProjects = await Project.countDocuments({
      status: {
        $nin: ['cancelled', 'handover_move_in']
      },
      ...serviceFilter
    });

    // Return all statistics with service type info
    res.status(200).json({
      success: true,
      data: {
        totalEmployees,
        totalLeads,
        pendingLeads,
        totalUsers,
        totalProjects,
        activeProjects,
        currentServiceType: serviceType || (req.user.role === 'super_admin' ? 'all' : req.user.serviceType),
        availableServiceTypes,
        userRole: req.user.role
      }
    });

  } catch (error) {
    console.error('Get dashboard stats error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching dashboard statistics',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

// @desc    Get recent activities for dashboard
// @route   GET /api/admin/dashboard/recent-activities
// @access  Private/Admin
exports.getRecentActivities = async (req, res) => {
  try {
    const limit = parseInt(req.query.limit) || 10;
    const { serviceType } = req.query;
    const serviceFilter = getServiceTypeFilter(req.user, serviceType);

    // Get recent leads with service filter
    const recentLeads = await Lead.find(serviceFilter)
      .sort({ createdAt: -1 })
      .limit(limit)
      .select('name email status createdAt serviceType');

    // Get recent projects with service filter
    const recentProjects = await Project.find(serviceFilter)
      .sort({ createdAt: -1 })
      .limit(limit)
      .populate('customer', 'fullName email')
      .select('title projectId status customer createdAt serviceType');

    // Get recent users (last 10) with service filter
    const recentUsers = await User.find({
      role: 'user',
      ...serviceFilter
    })
      .sort({ createdAt: -1 })
      .limit(limit)
      .select('fullName email createdAt');

    // Combine all activities and format them
    const activities = [];

    recentLeads.forEach(lead => {
      activities.push({
        type: 'lead',
        title: `New lead from ${lead.name}`,
        description: lead.email,
        status: lead.status,
        timestamp: lead.createdAt,
        icon: 'lead'
      });
    });

    recentProjects.forEach(project => {
      activities.push({
        type: 'project',
        title: `New project: ${project.title}`,
        description: project.customer ? `Customer: ${project.customer.fullName}` : 'No customer assigned',
        status: project.status,
        timestamp: project.createdAt,
        icon: 'project'
      });
    });

    recentUsers.forEach(user => {
      activities.push({
        type: 'user',
        title: `New user registered: ${user.fullName}`,
        description: user.email,
        status: 'active',
        timestamp: user.createdAt,
        icon: 'user'
      });
    });

    // Sort all activities by timestamp (newest first)
    activities.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));

    // Limit to requested number
    const limitedActivities = activities.slice(0, limit);

    res.status(200).json({
      success: true,
      data: limitedActivities
    });

  } catch (error) {
    console.error('Get recent activities error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching recent activities',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};
