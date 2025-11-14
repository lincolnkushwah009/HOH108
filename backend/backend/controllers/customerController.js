const User = require('../models/User');
const Employee = require('../models/Employee');
const { getServiceTypeFilter } = require('../utils/serviceTypeFilter');

// @desc    Get all customers
// @route   GET /api/admin/customers
// @access  Private/Admin
exports.getAllCustomers = async (req, res) => {
  try {
    const { page = 1, limit = 10, search, status, serviceType } = req.query;

    // Build query
    let query = {};

    if (search) {
      query.$or = [
        { fullName: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } },
        { customerId: { $regex: search, $options: 'i' } }
      ];
    }

    if (status) query.status = status;

    // Add role filter to only get users with role='user'
    query.role = 'user';

    // Add service type filter
    const serviceFilter = getServiceTypeFilter(req.user, serviceType);
    if (serviceFilter.serviceType) {
      query.serviceType = serviceFilter.serviceType;
    }

    // Execute query with pagination
    const customers = await User.find(query)
      .populate('assignedCRM', 'fullName email phone')
      .populate('assignedDesigner', 'fullName email phone specialization')
      .populate('projects')
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .sort({ createdAt: -1 });

    const count = await User.countDocuments(query);

    res.status(200).json({
      success: true,
      data: customers,
      pagination: {
        total: count,
        page: parseInt(page),
        pages: Math.ceil(count / limit),
        limit: parseInt(limit)
      }
    });

  } catch (error) {
    console.error('Get customers error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching customers',
      error: error.message
    });
  }
};

// @desc    Get single customer
// @route   GET /api/admin/customers/:id
// @access  Private/Admin
exports.getCustomer = async (req, res) => {
  try {
    const customer = await User.findById(req.params.id)
      .populate('assignedCRM', 'fullName email phone department')
      .populate('assignedDesigner', 'fullName email phone specialization portfolio')
      .populate('projects');

    if (!customer) {
      return res.status(404).json({
        success: false,
        message: 'Customer not found'
      });
    }

    res.status(200).json({
      success: true,
      data: customer
    });

  } catch (error) {
    console.error('Get customer error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching customer',
      error: error.message
    });
  }
};

// @desc    Create customer
// @route   POST /api/admin/customers
// @access  Private/Admin
exports.createCustomer = async (req, res) => {
  try {
    const { fullName, email, phone, password, address, assignedCRM, assignedDesigner, serviceType } = req.body;

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: 'User with this email already exists'
      });
    }

    // Determine service type - use provided or admin's service type
    let customerServiceType = serviceType;
    if (!customerServiceType) {
      if (req.user.role === 'admin' && req.user.serviceType) {
        customerServiceType = req.user.serviceType;
      } else {
        customerServiceType = 'interior'; // Default
      }
    }

    // Prepare customer data - filter out empty strings for ObjectId fields
    const customerData = {
      fullName,
      email,
      phone,
      password: password || 'customer123', // Default password
      role: 'user',
      address,
      serviceType: customerServiceType
    };

    // Only add assignedCRM and assignedDesigner if they have valid values
    if (assignedCRM && assignedCRM.trim() !== '') {
      customerData.assignedCRM = assignedCRM;
    }
    if (assignedDesigner && assignedDesigner.trim() !== '') {
      customerData.assignedDesigner = assignedDesigner;
    }

    // Create user with customer data (customerId will be auto-generated)
    const customer = new User(customerData);
    await customer.save();

    // Populate the customer data
    await customer.populate('assignedCRM assignedDesigner');

    res.status(201).json({
      success: true,
      message: 'Customer created successfully',
      data: customer
    });

  } catch (error) {
    console.error('Create customer error:', error);
    res.status(400).json({
      success: false,
      message: 'Error creating customer',
      error: error.message
    });
  }
};

// @desc    Update customer
// @route   PUT /api/admin/customers/:id
// @access  Private/Admin
exports.updateCustomer = async (req, res) => {
  try {
    const { fullName, email, phone, address, assignedCRM, assignedDesigner, status, kycStatus } = req.body;

    const customer = await User.findById(req.params.id);

    if (!customer) {
      return res.status(404).json({
        success: false,
        message: 'Customer not found'
      });
    }

    // Update customer fields
    if (fullName) customer.fullName = fullName;
    if (email) customer.email = email;
    if (phone) customer.phone = phone;
    if (address) customer.address = { ...customer.address, ...address };
    if (assignedCRM !== undefined) customer.assignedCRM = assignedCRM;
    if (assignedDesigner !== undefined) customer.assignedDesigner = assignedDesigner;
    if (status) customer.status = status;
    if (kycStatus) customer.kycStatus = kycStatus;

    await customer.save();

    // Populate the updated customer
    await customer.populate('assignedCRM assignedDesigner projects');

    res.status(200).json({
      success: true,
      message: 'Customer updated successfully',
      data: customer
    });

  } catch (error) {
    console.error('Update customer error:', error);
    res.status(400).json({
      success: false,
      message: 'Error updating customer',
      error: error.message
    });
  }
};

// @desc    Assign CRM to customer
// @route   PUT /api/admin/customers/:id/assign-crm
// @access  Private/Admin
exports.assignCRM = async (req, res) => {
  try {
    const { crmId } = req.body;

    if (!crmId) {
      return res.status(400).json({
        success: false,
        message: 'CRM ID is required'
      });
    }

    // Check if CRM exists
    const crm = await Employee.findById(crmId);
    if (!crm || crm.role !== 'crm') {
      return res.status(400).json({
        success: false,
        message: 'Invalid CRM ID'
      });
    }

    const customer = await User.findById(req.params.id);

    if (!customer) {
      return res.status(404).json({
        success: false,
        message: 'Customer not found'
      });
    }

    customer.assignedCRM = crmId;
    await customer.save();

    await customer.populate('assignedCRM assignedDesigner');

    res.status(200).json({
      success: true,
      message: 'CRM assigned successfully',
      data: customer
    });

  } catch (error) {
    console.error('Assign CRM error:', error);
    res.status(500).json({
      success: false,
      message: 'Error assigning CRM',
      error: error.message
    });
  }
};

// @desc    Assign Designer to customer
// @route   PUT /api/admin/customers/:id/assign-designer
// @access  Private/Admin
exports.assignDesigner = async (req, res) => {
  try {
    const { designerId } = req.body;

    if (!designerId) {
      return res.status(400).json({
        success: false,
        message: 'Designer ID is required'
      });
    }

    // Check if designer exists
    const designer = await Employee.findById(designerId);
    if (!designer || designer.role !== 'designer') {
      return res.status(400).json({
        success: false,
        message: 'Invalid Designer ID'
      });
    }

    const customer = await User.findById(req.params.id);

    if (!customer) {
      return res.status(404).json({
        success: false,
        message: 'Customer not found'
      });
    }

    customer.assignedDesigner = designerId;
    await customer.save();

    await customer.populate('assignedCRM assignedDesigner');

    res.status(200).json({
      success: true,
      message: 'Designer assigned successfully',
      data: customer
    });

  } catch (error) {
    console.error('Assign Designer error:', error);
    res.status(500).json({
      success: false,
      message: 'Error assigning designer',
      error: error.message
    });
  }
};

// @desc    Delete customer
// @route   DELETE /api/admin/customers/:id
// @access  Private/Admin
exports.deleteCustomer = async (req, res) => {
  try {
    const customer = await User.findById(req.params.id);

    if (!customer) {
      return res.status(404).json({
        success: false,
        message: 'Customer not found'
      });
    }

    // Delete the user (which contains all customer data)
    await User.findByIdAndDelete(req.params.id);

    res.status(200).json({
      success: true,
      message: 'Customer deleted successfully'
    });

  } catch (error) {
    console.error('Delete customer error:', error);
    res.status(500).json({
      success: false,
      message: 'Error deleting customer',
      error: error.message
    });
  }
};

// @desc    Get customer statistics
// @route   GET /api/admin/customers/stats
// @access  Private/Admin
exports.getCustomerStats = async (req, res) => {
  try {
    const { serviceType } = req.query;

    // Build base query with service type filter
    let baseQuery = { role: 'user' };
    const serviceFilter = getServiceTypeFilter(req.user, serviceType);
    if (serviceFilter.serviceType) {
      baseQuery.serviceType = serviceFilter.serviceType;
    }

    const totalCustomers = await User.countDocuments(baseQuery);
    const activeCustomers = await User.countDocuments({ ...baseQuery, status: 'active' });
    const verifiedKYC = await User.countDocuments({ ...baseQuery, kycStatus: 'verified' });
    const pendingKYC = await User.countDocuments({ ...baseQuery, kycStatus: 'pending' });

    res.status(200).json({
      success: true,
      data: {
        total: totalCustomers,
        active: activeCustomers,
        verifiedKYC,
        pendingKYC
      }
    });

  } catch (error) {
    console.error('Get customer stats error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching statistics',
      error: error.message
    });
  }
};
