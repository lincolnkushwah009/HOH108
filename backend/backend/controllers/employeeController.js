const Employee = require('../models/Employee');
const User = require('../models/User');
const bcrypt = require('bcryptjs');
const { getServiceTypeFilter } = require('../utils/serviceTypeFilter');

// @desc    Get all employees
// @route   GET /api/admin/employees
// @access  Private/Admin
exports.getAllEmployees = async (req, res) => {
  try {
    const { page = 1, limit = 10, search, role, status, department, serviceType } = req.query;

    // Build query
    let query = {};

    if (search) {
      query.$or = [
        { fullName: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } },
        { employeeId: { $regex: search, $options: 'i' } },
        { phone: { $regex: search, $options: 'i' } }
      ];
    }

    if (role) query.role = role;
    if (status) query.status = status;
    if (department) query.department = department;

    // Add service type filter
    const serviceFilter = getServiceTypeFilter(req.user, serviceType);
    if (serviceFilter.serviceType) {
      query.serviceType = serviceFilter.serviceType;
    }

    // Execute query with pagination
    const employees = await Employee.find(query)
      .populate('assignedProjects', 'projectId title status')
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .sort({ createdAt: -1 });

    const count = await Employee.countDocuments(query);

    res.json({
      success: true,
      data: employees,
      pagination: {
        total: count,
        page: parseInt(page),
        pages: Math.ceil(count / limit),
        limit: parseInt(limit)
      }
    });
  } catch (error) {
    console.error('Get employees error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching employees',
      error: error.message
    });
  }
};

// @desc    Get single employee
// @route   GET /api/admin/employees/:id
// @access  Private/Admin
exports.getEmployee = async (req, res) => {
  try {
    const employee = await Employee.findById(req.params.id)
      .populate('assignedProjects');

    if (!employee) {
      return res.status(404).json({
        success: false,
        message: 'Employee not found'
      });
    }

    res.json({
      success: true,
      data: employee
    });
  } catch (error) {
    console.error('Get employee error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching employee',
      error: error.message
    });
  }
};

// @desc    Create new employee
// @route   POST /api/admin/employees
// @access  Private/Admin
exports.createEmployee = async (req, res) => {
  try {
    const {
      employeeId,
      fullName,
      email,
      phone,
      role,
      department,
      status,
      joiningDate,
      password,
      address
    } = req.body;

    // Validate password
    if (!password || password.length < 6) {
      return res.status(400).json({
        success: false,
        message: 'Password is required and must be at least 6 characters'
      });
    }

    // Check if employee with same email or employeeId exists
    const existingEmployee = await Employee.findOne({
      $or: [{ email }, { employeeId }]
    });

    if (existingEmployee) {
      return res.status(400).json({
        success: false,
        message: 'Employee with this email or ID already exists'
      });
    }

    // Check if user with same email exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: 'User with this email already exists'
      });
    }

    // Map role to department if department not provided or invalid
    const roleToDepartmentMap = {
      'designer': 'design',
      'crm': 'sales',
      'sales': 'sales',
      'support': 'support',
      'manager': 'management'
    };

    // Normalize department - use role mapping if department is invalid
    let normalizedDepartment = department ? department.toLowerCase() : '';
    if (!['design', 'sales', 'support', 'management'].includes(normalizedDepartment)) {
      normalizedDepartment = roleToDepartmentMap[role] || 'design';
    }

    // Determine service type - use provided or admin's service type
    let employeeServiceType = req.body.serviceType;
    if (!employeeServiceType) {
      if (req.user.role === 'admin' && req.user.serviceType) {
        employeeServiceType = req.user.serviceType;
      } else {
        employeeServiceType = 'interior'; // Default
      }
    }

    // Create employee
    const employee = await Employee.create({
      employeeId,
      fullName,
      email,
      phone,
      role,
      department: normalizedDepartment,
      status: status || 'active',
      joiningDate: joiningDate || Date.now(),
      address,
      serviceType: employeeServiceType
    });

    // Create User account for login
    const user = await User.create({
      fullName,
      email,
      phone,
      password,
      role: role === 'manager' ? 'manager' : role, // manager, designer, crm, etc.
      status: 'active'
    });

    res.status(201).json({
      success: true,
      data: employee,
      user: { email: user.email, role: user.role },
      message: 'Employee and login account created successfully'
    });
  } catch (error) {
    console.error('Create employee error:', error);
    res.status(400).json({
      success: false,
      message: 'Error creating employee',
      error: error.message
    });
  }
};

// @desc    Update employee
// @route   PUT /api/admin/employees/:id
// @access  Private/Admin
exports.updateEmployee = async (req, res) => {
  try {
    const employee = await Employee.findById(req.params.id);

    if (!employee) {
      return res.status(404).json({
        success: false,
        message: 'Employee not found'
      });
    }

    // Update employee
    const updatedEmployee = await Employee.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        new: true,
        runValidators: true
      }
    );

    res.json({
      success: true,
      data: updatedEmployee,
      message: 'Employee updated successfully'
    });
  } catch (error) {
    console.error('Update employee error:', error);
    res.status(400).json({
      success: false,
      message: 'Error updating employee',
      error: error.message
    });
  }
};

// @desc    Delete employee
// @route   DELETE /api/admin/employees/:id
// @access  Private/Admin
exports.deleteEmployee = async (req, res) => {
  try {
    const employee = await Employee.findById(req.params.id);

    if (!employee) {
      return res.status(404).json({
        success: false,
        message: 'Employee not found'
      });
    }

    await Employee.findByIdAndDelete(req.params.id);

    res.json({
      success: true,
      message: 'Employee deleted successfully'
    });
  } catch (error) {
    console.error('Delete employee error:', error);
    res.status(500).json({
      success: false,
      message: 'Error deleting employee',
      error: error.message
    });
  }
};

// @desc    Get employees by role
// @route   GET /api/admin/employees/role/:role
// @access  Private/Admin
exports.getEmployeesByRole = async (req, res) => {
  try {
    const { serviceType } = req.query;

    // Build query with service type filter
    let query = {
      role: req.params.role,
      status: 'active'
    };

    const serviceFilter = getServiceTypeFilter(req.user, serviceType);
    if (serviceFilter.serviceType) {
      query.serviceType = serviceFilter.serviceType;
    }

    const employees = await Employee.find(query).select('employeeId fullName email phone portfolio');

    res.json({
      success: true,
      data: employees,
      count: employees.length
    });
  } catch (error) {
    console.error('Get employees by role error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching employees',
      error: error.message
    });
  }
};

// @desc    Get employee statistics
// @route   GET /api/admin/employees/stats
// @access  Private/Admin
exports.getEmployeeStats = async (req, res) => {
  try {
    const { serviceType } = req.query;

    // Build base query with service type filter
    let baseQuery = {};
    const serviceFilter = getServiceTypeFilter(req.user, serviceType);
    if (serviceFilter.serviceType) {
      baseQuery.serviceType = serviceFilter.serviceType;
    }

    const totalEmployees = await Employee.countDocuments(baseQuery);
    const activeEmployees = await Employee.countDocuments({ ...baseQuery, status: 'active' });
    const inactiveEmployees = await Employee.countDocuments({ ...baseQuery, status: 'inactive' });
    const onLeaveEmployees = await Employee.countDocuments({ ...baseQuery, status: 'on-leave' });

    // Aggregate with service type filter
    const rolePipeline = [];
    if (baseQuery.serviceType) {
      rolePipeline.push({ $match: { serviceType: baseQuery.serviceType } });
    }
    rolePipeline.push({ $group: { _id: '$role', count: { $sum: 1 } } });
    const employeesByRole = await Employee.aggregate(rolePipeline);

    const deptPipeline = [];
    if (baseQuery.serviceType) {
      deptPipeline.push({ $match: { serviceType: baseQuery.serviceType } });
    }
    deptPipeline.push({ $group: { _id: '$department', count: { $sum: 1 } } });
    const employeesByDepartment = await Employee.aggregate(deptPipeline);

    res.json({
      success: true,
      data: {
        total: totalEmployees,
        active: activeEmployees,
        inactive: inactiveEmployees,
        onLeave: onLeaveEmployees,
        byRole: employeesByRole,
        byDepartment: employeesByDepartment
      }
    });
  } catch (error) {
    console.error('Get employee stats error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching statistics',
      error: error.message
    });
  }
};

// @desc    Change employee password (Admin only)
// @route   PUT /api/admin/employees/:id/change-password
// @access  Private/Admin
exports.changeEmployeePassword = async (req, res) => {
  try {
    const { newPassword } = req.body;

    if (!newPassword) {
      return res.status(400).json({
        success: false,
        message: 'New password is required'
      });
    }

    if (newPassword.length < 6) {
      return res.status(400).json({
        success: false,
        message: 'Password must be at least 6 characters long'
      });
    }

    // Find the employee
    const employee = await Employee.findById(req.params.id);

    if (!employee) {
      return res.status(404).json({
        success: false,
        message: 'Employee not found'
      });
    }

    // Find the associated user account by email
    const user = await User.findOne({ email: employee.email });

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User account not found for this employee'
      });
    }

    // Hash the new password
    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(newPassword, salt);

    await user.save();

    res.json({
      success: true,
      message: 'Employee password changed successfully'
    });
  } catch (error) {
    console.error('Change employee password error:', error);
    res.status(500).json({
      success: false,
      message: 'Error changing employee password',
      error: error.message
    });
  }
};
