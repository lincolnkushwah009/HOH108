const Project = require('../models/Project');
const User = require('../models/User');
const Employee = require('../models/Employee');
const { getServiceTypeFilter } = require('../utils/serviceTypeFilter');

// @desc    Get all projects
// @route   GET /api/admin/projects
// @access  Private/Admin
exports.getAllProjects = async (req, res) => {
  try {
    const { page = 1, limit = 10, search, status, customerId, serviceType } = req.query;
    const userRole = req.user.role; // From auth middleware
    const userEmail = req.user.email;

    // Build query
    let query = {};

    // Role-based filtering
    if (userRole === 'designer' || userRole === 'crm') {
      // Find the employee record for this user
      const employee = await Employee.findOne({ email: userEmail });

      if (!employee) {
        return res.status(404).json({
          success: false,
          message: 'Employee record not found'
        });
      }

      // Filter projects based on role
      if (userRole === 'designer') {
        query.assignedDesigner = employee._id;
      } else if (userRole === 'crm') {
        query.assignedCRM = employee._id;
      }
    }
    // Admin and manager can see all projects (no additional filtering)

    if (search) {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { projectId: { $regex: search, $options: 'i' } }
      ];
    }

    if (status) query.status = status;
    if (customerId) query.customer = customerId;

    // Add service type filter
    const serviceFilter = getServiceTypeFilter(req.user, serviceType);
    if (serviceFilter.serviceType) {
      query.serviceType = serviceFilter.serviceType;
    }

    // Execute query with pagination
    const projects = await Project.find(query)
      .populate('customer', 'fullName email customerId')
      .populate('assignedDesigner', 'fullName email phone specialization')
      .populate('assignedCRM', 'fullName email phone')
      .populate('designs')
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .sort({ createdAt: -1 });

    const count = await Project.countDocuments(query);

    res.status(200).json({
      success: true,
      data: projects,
      pagination: {
        total: count,
        page: parseInt(page),
        pages: Math.ceil(count / limit),
        limit: parseInt(limit)
      }
    });

  } catch (error) {
    console.error('Get projects error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching projects',
      error: error.message
    });
  }
};

// @desc    Get single project
// @route   GET /api/admin/projects/:id
// @access  Private/Admin
exports.getProject = async (req, res) => {
  try {
    const project = await Project.findById(req.params.id)
      .populate('customer', 'fullName email phone customerId address')
      .populate('assignedDesigner', 'fullName email phone specialization portfolio')
      .populate('assignedCRM', 'fullName email phone')
      .populate({
        path: 'designs',
        populate: {
          path: 'designer',
          select: 'fullName email'
        }
      });

    if (!project) {
      return res.status(404).json({
        success: false,
        message: 'Project not found'
      });
    }

    res.status(200).json({
      success: true,
      data: project
    });

  } catch (error) {
    console.error('Get project error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching project',
      error: error.message
    });
  }
};

// @desc    Create project
// @route   POST /api/admin/projects
// @access  Private/Admin
exports.createProject = async (req, res) => {
  try {
    const {
      title,
      description,
      customerId,
      assignedDesigner,
      assignedCRM,
      projectType,
      roomTypes,
      carpetArea,
      budget,
      location,
      timeline
    } = req.body;

    // Validate required fields
    if (!title || !customerId || !projectType || !carpetArea) {
      return res.status(400).json({
        success: false,
        message: 'Please provide all required fields (title, customer, projectType, carpetArea)'
      });
    }

    // Check if customer (user) exists
    const customer = await User.findById(customerId);
    if (!customer || customer.role !== 'user') {
      return res.status(404).json({
        success: false,
        message: 'Customer not found'
      });
    }

    // Validate designer if provided
    if (assignedDesigner) {
      const designer = await Employee.findById(assignedDesigner);
      if (!designer || designer.role !== 'designer') {
        return res.status(400).json({
          success: false,
          message: 'Invalid designer ID'
        });
      }
    }

    // Validate CRM if provided
    if (assignedCRM && assignedCRM.trim() !== '') {
      const crm = await Employee.findById(assignedCRM);
      if (!crm || crm.role !== 'crm') {
        return res.status(400).json({
          success: false,
          message: 'Invalid CRM ID'
        });
      }
    }

    // Determine service type - use provided or admin's service type or customer's service type
    let projectServiceType = req.body.serviceType;
    if (!projectServiceType) {
      if (customer.serviceType) {
        projectServiceType = customer.serviceType;
      } else if (req.user.role === 'admin' && req.user.serviceType) {
        projectServiceType = req.user.serviceType;
      } else {
        projectServiceType = 'interior'; // Default
      }
    }

    // Prepare project data - filter out empty strings for ObjectId fields
    const projectData = {
      title,
      description,
      customer: customerId,
      projectType,
      roomTypes: roomTypes || [],
      carpetArea,
      budget,
      location,
      serviceType: projectServiceType
    };

    // Only add timeline if it's a valid object with expectedEndDate as a valid date
    if (timeline && typeof timeline === 'object' && timeline.expectedEndDate) {
      // Check if expectedEndDate is a valid date
      const date = new Date(timeline.expectedEndDate);
      if (!isNaN(date.getTime())) {
        projectData.timeline = timeline;
      }
    }

    // Only add assignedDesigner if valid value provided, otherwise use customer's assigned designer
    const designerValue = assignedDesigner && assignedDesigner.trim() !== '' ? assignedDesigner : customer.assignedDesigner;
    if (designerValue) {
      projectData.assignedDesigner = designerValue;
    }

    // Only add assignedCRM if valid value provided, otherwise use customer's assigned CRM
    const crmValue = assignedCRM && assignedCRM.trim() !== '' ? assignedCRM : customer.assignedCRM;
    if (crmValue) {
      projectData.assignedCRM = crmValue;
    }

    // Create project using new + save to trigger pre-save hook for projectId
    const project = new Project(projectData);
    await project.save();

    // Add project to customer's projects array
    customer.projects.push(project._id);
    await customer.save();

    // Add project to assigned designer's projects array
    if (projectData.assignedDesigner) {
      const designer = await Employee.findById(projectData.assignedDesigner);
      if (designer && !designer.assignedProjects.includes(project._id)) {
        designer.assignedProjects.push(project._id);
        await designer.save();
      }
    }

    // Add project to assigned CRM's projects array
    if (projectData.assignedCRM) {
      const crm = await Employee.findById(projectData.assignedCRM);
      if (crm && !crm.assignedProjects.includes(project._id)) {
        crm.assignedProjects.push(project._id);
        await crm.save();
      }
    }

    // Populate the project data
    await project.populate('customer assignedDesigner assignedCRM');

    res.status(201).json({
      success: true,
      message: 'Project created successfully',
      data: project
    });

  } catch (error) {
    console.error('Create project error:', error);
    res.status(400).json({
      success: false,
      message: 'Error creating project',
      error: error.message
    });
  }
};

// @desc    Update project
// @route   PUT /api/admin/projects/:id
// @access  Private/Admin
exports.updateProject = async (req, res) => {
  try {
    const {
      title,
      description,
      assignedDesigner,
      assignedCRM,
      projectType,
      roomTypes,
      carpetArea,
      budget,
      location,
      timeline,
      status,
      milestones,
      notes
    } = req.body;

    const project = await Project.findById(req.params.id);

    if (!project) {
      return res.status(404).json({
        success: false,
        message: 'Project not found'
      });
    }

    // Update fields
    if (title) project.title = title;
    if (description !== undefined) project.description = description;

    // Handle ObjectId fields - convert empty strings to null
    // Track old assignments for cleanup
    const oldDesigner = project.assignedDesigner;
    const oldCRM = project.assignedCRM;

    if (assignedDesigner !== undefined) {
      project.assignedDesigner = assignedDesigner === '' ? null : assignedDesigner;
    }
    if (assignedCRM !== undefined) {
      project.assignedCRM = assignedCRM === '' ? null : assignedCRM;
    }
    if (projectType) project.projectType = projectType;
    if (roomTypes) project.roomTypes = roomTypes;
    if (carpetArea) project.carpetArea = carpetArea;
    if (budget) project.budget = { ...project.budget, ...budget };
    if (location) project.location = { ...project.location, ...location };

    // Only update timeline if it's valid
    if (timeline && typeof timeline === 'object') {
      const updatedTimeline = { ...project.timeline, ...timeline };
      // Validate expectedEndDate if provided
      if (updatedTimeline.expectedEndDate) {
        const date = new Date(updatedTimeline.expectedEndDate);
        if (!isNaN(date.getTime())) {
          project.timeline = updatedTimeline;
        }
      } else {
        project.timeline = updatedTimeline;
      }
    }

    if (status) project.status = status;
    if (milestones) project.milestones = milestones;
    if (notes !== undefined) project.notes = notes;

    await project.save();

    // Update employee assignedProjects arrays
    // Remove from old designer's array if changed
    if (assignedDesigner !== undefined && oldDesigner && oldDesigner.toString() !== project.assignedDesigner?.toString()) {
      const oldDesignerDoc = await Employee.findById(oldDesigner);
      if (oldDesignerDoc) {
        oldDesignerDoc.assignedProjects = oldDesignerDoc.assignedProjects.filter(
          p => p.toString() !== project._id.toString()
        );
        await oldDesignerDoc.save();
      }
    }

    // Add to new designer's array
    if (project.assignedDesigner && (!oldDesigner || oldDesigner.toString() !== project.assignedDesigner.toString())) {
      const newDesignerDoc = await Employee.findById(project.assignedDesigner);
      if (newDesignerDoc && !newDesignerDoc.assignedProjects.includes(project._id)) {
        newDesignerDoc.assignedProjects.push(project._id);
        await newDesignerDoc.save();
      }
    }

    // Remove from old CRM's array if changed
    if (assignedCRM !== undefined && oldCRM && oldCRM.toString() !== project.assignedCRM?.toString()) {
      const oldCRMDoc = await Employee.findById(oldCRM);
      if (oldCRMDoc) {
        oldCRMDoc.assignedProjects = oldCRMDoc.assignedProjects.filter(
          p => p.toString() !== project._id.toString()
        );
        await oldCRMDoc.save();
      }
    }

    // Add to new CRM's array
    if (project.assignedCRM && (!oldCRM || oldCRM.toString() !== project.assignedCRM.toString())) {
      const newCRMDoc = await Employee.findById(project.assignedCRM);
      if (newCRMDoc && !newCRMDoc.assignedProjects.includes(project._id)) {
        newCRMDoc.assignedProjects.push(project._id);
        await newCRMDoc.save();
      }
    }

    // Populate the updated project
    await project.populate('customer assignedDesigner assignedCRM designs');

    res.status(200).json({
      success: true,
      message: 'Project updated successfully',
      data: project
    });

  } catch (error) {
    console.error('Update project error:', error);
    res.status(400).json({
      success: false,
      message: 'Error updating project',
      error: error.message
    });
  }
};

// @desc    Delete project
// @route   DELETE /api/admin/projects/:id
// @access  Private/Admin
exports.deleteProject = async (req, res) => {
  try {
    const project = await Project.findById(req.params.id);

    if (!project) {
      return res.status(404).json({
        success: false,
        message: 'Project not found'
      });
    }

    // Remove project from customer's (user's) projects array
    await User.findByIdAndUpdate(
      project.customer,
      { $pull: { projects: project._id } }
    );

    await Project.findByIdAndDelete(req.params.id);

    res.status(200).json({
      success: true,
      message: 'Project deleted successfully'
    });

  } catch (error) {
    console.error('Delete project error:', error);
    res.status(500).json({
      success: false,
      message: 'Error deleting project',
      error: error.message
    });
  }
};

// @desc    Add milestone to project
// @route   POST /api/admin/projects/:id/milestones
// @access  Private/Admin
exports.addMilestone = async (req, res) => {
  try {
    const { name, description, dueDate, payment } = req.body;

    const project = await Project.findById(req.params.id);

    if (!project) {
      return res.status(404).json({
        success: false,
        message: 'Project not found'
      });
    }

    project.milestones.push({
      name,
      description,
      dueDate,
      payment
    });

    await project.save();

    res.status(200).json({
      success: true,
      message: 'Milestone added successfully',
      data: project
    });

  } catch (error) {
    console.error('Add milestone error:', error);
    res.status(400).json({
      success: false,
      message: 'Error adding milestone',
      error: error.message
    });
  }
};

// @desc    Get project statistics
// @route   GET /api/admin/projects/stats
// @access  Private/Admin
exports.getProjectStats = async (req, res) => {
  try {
    const { serviceType } = req.query;

    // Build base query with service type filter
    let baseQuery = {};
    const serviceFilter = getServiceTypeFilter(req.user, serviceType);
    if (serviceFilter.serviceType) {
      baseQuery.serviceType = serviceFilter.serviceType;
    }

    const totalProjects = await Project.countDocuments(baseQuery);
    const activeProjects = await Project.countDocuments({
      ...baseQuery,
      status: { $in: ['design', 'approval_pending', 'approved', 'in_progress'] }
    });
    const completedProjects = await Project.countDocuments({ ...baseQuery, status: 'completed' });
    const onHoldProjects = await Project.countDocuments({ ...baseQuery, status: 'on_hold' });

    // Projects by type (with service type filter)
    const typePipeline = [];
    if (baseQuery.serviceType) {
      typePipeline.push({ $match: { serviceType: baseQuery.serviceType } });
    }
    typePipeline.push({ $group: { _id: '$projectType', count: { $sum: 1 } } });
    const projectsByType = await Project.aggregate(typePipeline);

    res.status(200).json({
      success: true,
      data: {
        total: totalProjects,
        active: activeProjects,
        completed: completedProjects,
        onHold: onHoldProjects,
        byType: projectsByType
      }
    });

  } catch (error) {
    console.error('Get project stats error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching statistics',
      error: error.message
    });
  }
};
