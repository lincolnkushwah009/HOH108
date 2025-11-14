const jwt = require('jsonwebtoken');
const User = require('../models/User');
const ServiceProvider = require('../models/ServiceProvider');

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-change-in-production';

// Middleware to protect routes
exports.protect = async (req, res, next) => {
  try {
    let token;

    // Check for token in headers
    if (
      req.headers.authorization &&
      req.headers.authorization.startsWith('Bearer')
    ) {
      token = req.headers.authorization.split(' ')[1];
    }

    // Check if token exists
    if (!token) {
      return res.status(401).json({
        success: false,
        message: 'Not authorized to access this route. Please login.'
      });
    }

    try {
      // Verify token
      const decoded = jwt.verify(token, JWT_SECRET);

      // Get user from token - check User collection first
      let user = await User.findById(decoded.id);

      // If not found in User collection, check ServiceProvider collection
      if (!user) {
        user = await ServiceProvider.findById(decoded.id);
      }

      if (!user) {
        return res.status(401).json({
          success: false,
          message: 'User not found'
        });
      }

      // Handle different status fields for User and ServiceProvider
      if (user.isActive !== undefined && !user.isActive) {
        return res.status(403).json({
          success: false,
          message: 'Your account has been deactivated'
        });
      } else if (user.status !== undefined && !['active', 'pending_verification'].includes(user.status)) {
        return res.status(403).json({
          success: false,
          message: `Your account is ${user.status}. Please contact support.`
        });
      }

      // Attach user to request
      req.user = user;
      next();

    } catch (error) {
      return res.status(401).json({
        success: false,
        message: 'Invalid or expired token'
      });
    }

  } catch (error) {
    console.error('Auth middleware error:', error);
    res.status(500).json({
      success: false,
      message: 'Authentication error'
    });
  }
};

// Middleware to check for admin role
exports.authorize = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        message: `User role '${req.user.role}' is not authorized to access this route`
      });
    }
    next();
  };
};

// Middleware to check for any admin role
exports.adminOnly = (req, res, next) => {
  const adminRoles = [
    'admin',
    'super_admin',
    'interior_admin',
    'construction_admin',
    'renovation_admin',
    'on_demand_admin'
  ];

  if (!adminRoles.includes(req.user.role)) {
    return res.status(403).json({
      success: false,
      message: 'Access denied. Admin privileges required.'
    });
  }
  next();
};

// Middleware to check for super admin only
exports.superAdminOnly = (req, res, next) => {
  if (req.user.role !== 'super_admin') {
    return res.status(403).json({
      success: false,
      message: 'Access denied. Super admin privileges required.'
    });
  }
  next();
};

// Middleware to check vertical access
exports.checkVerticalAccess = (vertical) => {
  return (req, res, next) => {
    // Super admin has access to all verticals
    if (req.user.role === 'super_admin') {
      return next();
    }

    // Use the User model's method to check vertical access
    if (!req.user.hasVerticalAccess(vertical)) {
      return res.status(403).json({
        success: false,
        message: `Access denied. You don't have permission to access ${vertical} vertical.`
      });
    }

    next();
  };
};

// Middleware to check if user has access to requested vertical (from query params)
exports.checkVerticalFromQuery = (req, res, next) => {
  const vertical = req.query.serviceType || req.body.serviceType;

  // If no vertical specified, allow (will default to user's vertical)
  if (!vertical) {
    return next();
  }

  // Super admin has access to all
  if (req.user.role === 'super_admin') {
    return next();
  }

  // Check access
  if (!req.user.hasVerticalAccess(vertical)) {
    return res.status(403).json({
      success: false,
      message: `Access denied. You don't have permission to access ${vertical} vertical.`
    });
  }

  next();
};

// Helper function to get service type filter based on user role
exports.getServiceTypeFilter = (user, requestedServiceType) => {
  // Super admin can access all
  if (user.role === 'super_admin') {
    return requestedServiceType && requestedServiceType !== 'all'
      ? { serviceType: requestedServiceType }
      : {};
  }

  // Get user's accessible verticals
  const accessibleVerticals = user.getAccessibleVerticals();

  // If requested a specific service type, verify access
  if (requestedServiceType && requestedServiceType !== 'all') {
    if (!accessibleVerticals.includes(requestedServiceType)) {
      throw new Error(`Access denied to ${requestedServiceType} vertical`);
    }
    return { serviceType: requestedServiceType };
  }

  // Return filter for user's accessible verticals
  if (accessibleVerticals.length === 1) {
    return { serviceType: accessibleVerticals[0] };
  } else if (accessibleVerticals.length > 1) {
    return { serviceType: { $in: accessibleVerticals } };
  }

  return {};
};
