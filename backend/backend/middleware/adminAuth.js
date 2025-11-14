/**
 * Admin Authorization Middleware
 *
 * Checks if user has admin role and specific permissions
 */

// Check if user is admin or super_admin
exports.isAdmin = (req, res, next) => {
  if (!req.user) {
    return res.status(401).json({
      success: false,
      message: 'Authentication required'
    });
  }

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

// Check if user is super_admin only
exports.isSuperAdmin = (req, res, next) => {
  if (!req.user) {
    return res.status(401).json({
      success: false,
      message: 'Authentication required'
    });
  }

  if (req.user.role !== 'super_admin') {
    return res.status(403).json({
      success: false,
      message: 'Access denied. Super Admin privileges required.'
    });
  }

  next();
};

// Check if user has specific permission
exports.hasPermission = (permission) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: 'Authentication required'
      });
    }

    // Super Admin and all vertical admin roles have all permissions
    const fullAccessRoles = [
      'admin',
      'super_admin',
      'interior_admin',
      'construction_admin',
      'renovation_admin',
      'on_demand_admin'
    ];

    if (fullAccessRoles.includes(req.user.role)) {
      return next();
    }

    // Check if user has the specific permission
    if (!req.user.permissions || !req.user.permissions.includes(permission)) {
      return res.status(403).json({
        success: false,
        message: `Permission denied. Required: ${permission}`
      });
    }

    next();
  };
};

// Check if user has any of the specified roles
exports.hasRole = (...roles) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: 'Authentication required'
      });
    }

    if (!roles.includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        message: `Access denied. Required role: ${roles.join(' or ')}`
      });
    }

    next();
  };
};
