/**
 * Service Type Filter Utility
 * Helps filter data by service type based on user role
 */

/**
 * Get service type filter for query
 * @param {Object} user - The authenticated user object
 * @param {String} requestedServiceType - Optional service type from query params
 * @returns {Object} - Query filter object
 */
exports.getServiceTypeFilter = (user, requestedServiceType = null) => {
  // Super Admin can see all service types
  if (user.role === 'super_admin') {
    // If a specific service type is requested, filter by it
    if (requestedServiceType && ['interior', 'construction', 'renovation', 'on_demand'].includes(requestedServiceType)) {
      return { serviceType: requestedServiceType };
    }
    // Otherwise, return empty filter (show all)
    return {};
  }

  // Vertical admins can only see their assigned service type
  if (user.role === 'interior_admin') {
    return { serviceType: 'interior' };
  }
  if (user.role === 'construction_admin') {
    return { serviceType: 'construction' };
  }
  if (user.role === 'renovation_admin') {
    return { serviceType: 'renovation' };
  }
  if (user.role === 'on_demand_admin') {
    return { serviceType: 'on_demand' };
  }

  // Regular admin can only see their assigned service type
  if (user.role === 'admin' && user.serviceType) {
    return { serviceType: user.serviceType };
  }

  // Default: return interior
  return { serviceType: 'interior' };
};

/**
 * Check if user has access to a specific service type
 * @param {Object} user - The authenticated user object
 * @param {String} serviceType - The service type to check
 * @returns {Boolean} - True if user has access
 */
exports.hasServiceTypeAccess = (user, serviceType) => {
  // Super Admin has access to all
  if (user.role === 'super_admin') {
    return true;
  }

  // Vertical admins have access only to their service type
  if (user.role === 'interior_admin') {
    return serviceType === 'interior';
  }
  if (user.role === 'construction_admin') {
    return serviceType === 'construction';
  }
  if (user.role === 'renovation_admin') {
    return serviceType === 'renovation';
  }
  if (user.role === 'on_demand_admin') {
    return serviceType === 'on_demand';
  }

  // Regular admin has access only to their service type
  if (user.role === 'admin') {
    return user.serviceType === serviceType;
  }

  return false;
};

/**
 * Get list of service types user can access
 * @param {Object} user - The authenticated user object
 * @returns {Array} - Array of service types
 */
exports.getUserServiceTypes = (user) => {
  if (user.role === 'super_admin') {
    return ['interior', 'construction', 'renovation', 'on_demand'];
  }

  // Vertical admins return their specific service type
  if (user.role === 'interior_admin') {
    return ['interior'];
  }
  if (user.role === 'construction_admin') {
    return ['construction'];
  }
  if (user.role === 'renovation_admin') {
    return ['renovation'];
  }
  if (user.role === 'on_demand_admin') {
    return ['on_demand'];
  }

  if (user.role === 'admin' && user.serviceType) {
    return [user.serviceType];
  }

  return ['interior'];
};
