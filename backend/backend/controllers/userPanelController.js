const User = require('../models/User');
const Project = require('../models/Project');
const Design = require('../models/Design');
const Employee = require('../models/Employee');

// @desc    Get user's customer profile
// @route   GET /api/user/profile
// @access  Private
exports.getUserProfile = async (req, res) => {
  try {
    const customer = await User.findById(req.user.id)
      .populate('assignedCRM', 'fullName email phone')
      .populate('assignedDesigner', 'fullName email phone portfolio');

    if (!customer) {
      return res.status(404).json({
        success: false,
        message: 'Customer profile not found'
      });
    }

    res.status(200).json({
      success: true,
      data: customer
    });

  } catch (error) {
    console.error('Get user profile error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching profile',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

// @desc    Get user's projects
// @route   GET /api/user/projects
// @access  Private
exports.getUserProjects = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    let projects;

    // Different query based on user role
    if (user.role === 'user') {
      // For customers: get projects where they are the customer
      projects = await Project.find({ customer: req.user.id })
        .populate('assignedDesigner', 'fullName email phone specialization portfolio')
        .populate('assignedCRM', 'fullName email phone')
        .populate('designs')
        .sort({ createdAt: -1 });
    } else if (user.role === 'designer') {
      // For designers: get projects where they are assigned as designer
      // First find the Employee record linked to this User
      console.log(`🔍 Looking for Employee with email: ${user.email}`);
      const employee = await Employee.findOne({ email: user.email });
      console.log(`🔍 Found Employee:`, employee);

      if (!employee) {
        console.log(`❌ No Employee found with email: ${user.email}`);
        return res.status(404).json({
          success: false,
          message: 'Employee profile not found'
        });
      }

      console.log(`🔍 Searching for projects with assignedDesigner: ${employee._id}`);
      projects = await Project.find({ assignedDesigner: employee._id })
        .populate('customer', 'fullName email phone customerId')
        .populate('assignedDesigner', 'fullName email phone specialization')
        .populate('assignedCRM', 'fullName email phone')
        .populate('designs')
        .sort({ createdAt: -1 });
      console.log(`🔍 Found ${projects.length} projects for designer`);
    } else if (user.role === 'crm') {
      // For CRM: get projects where they are assigned as CRM
      console.log(`🔍 Looking for Employee with email: ${user.email}`);
      const employee = await Employee.findOne({ email: user.email });
      console.log(`🔍 Found Employee:`, employee);

      if (!employee) {
        console.log(`❌ No Employee found with email: ${user.email}`);
        return res.status(404).json({
          success: false,
          message: 'Employee profile not found'
        });
      }

      console.log(`🔍 Searching for projects with assignedCRM: ${employee._id}`);
      projects = await Project.find({ assignedCRM: employee._id })
        .populate('customer', 'fullName email phone customerId')
        .populate('assignedDesigner', 'fullName email phone specialization')
        .populate('assignedCRM', 'fullName email phone')
        .populate('designs')
        .sort({ createdAt: -1 });
      console.log(`🔍 Found ${projects.length} projects for CRM`);
    } else {
      // For admin/manager: return all projects
      projects = await Project.find({})
        .populate('customer', 'fullName email phone customerId')
        .populate('assignedDesigner', 'fullName email phone specialization')
        .populate('assignedCRM', 'fullName email phone')
        .populate('designs')
        .sort({ createdAt: -1 });
    }

    // Debug logging
    console.log(`📊 getUserProjects - Role: ${user.role}, Projects count: ${projects.length}`);
    if (projects.length > 0) {
      console.log(`📊 First project customer data:`, projects[0].customer);
    }

    res.status(200).json({
      success: true,
      data: projects
    });

  } catch (error) {
    console.error('Get user projects error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching projects',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

// @desc    Get single project details
// @route   GET /api/user/projects/:id
// @access  Private
exports.getProjectDetails = async (req, res) => {
  try {
    const customer = await User.findById(req.user.id);

    if (!customer) {
      return res.status(404).json({
        success: false,
        message: 'Customer profile not found'
      });
    }

    const project = await Project.findOne({
      _id: req.params.id,
      customer: req.user.id
    })
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
        message: 'Project not found or you do not have access to this project'
      });
    }

    res.status(200).json({
      success: true,
      data: project
    });

  } catch (error) {
    console.error('Get project details error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching project details',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

// @desc    Get user's KYC details
// @route   GET /api/user/kyc
// @access  Private
exports.getKYCDetails = async (req, res) => {
  try {
    const customer = await User.findById(req.user.id);

    if (!customer) {
      return res.status(404).json({
        success: false,
        message: 'Customer profile not found'
      });
    }

    const kycData = {
      kycStatus: customer.kycStatus,
      kycDocuments: customer.kycDocuments,
      address: customer.address
    };

    res.status(200).json({
      success: true,
      data: kycData
    });

  } catch (error) {
    console.error('Get KYC details error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching KYC details',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

// @desc    Get assigned designer details
// @route   GET /api/user/designer
// @access  Private
exports.getDesignerDetails = async (req, res) => {
  try {
    const customer = await User.findById(req.user.id)
      .populate('assignedDesigner');

    if (!customer) {
      return res.status(404).json({
        success: false,
        message: 'Customer profile not found'
      });
    }

    if (!customer.assignedDesigner) {
      return res.status(404).json({
        success: false,
        message: 'No designer assigned yet'
      });
    }

    const designer = customer.assignedDesigner;

    res.status(200).json({
      success: true,
      data: {
        fullName: designer.fullName,
        email: designer.email,
        phone: designer.phone,
        specialization: designer.specialization,
        portfolio: designer.portfolio,
        bio: designer.bio
      }
    });

  } catch (error) {
    console.error('Get designer details error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching designer details',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

// @desc    Get user's design files
// @route   GET /api/user/designs
// @access  Private
exports.getDesigns = async (req, res) => {
  try {
    const customer = await User.findById(req.user.id);

    if (!customer) {
      return res.status(404).json({
        success: false,
        message: 'Customer profile not found'
      });
    }

    // Get all projects for this customer (user)
    const projects = await Project.find({ customer: req.user.id }).select('_id');
    const projectIds = projects.map(p => p._id);

    // Get all designs for these projects
    const designs = await Design.find({ project: { $in: projectIds } })
      .populate('project', 'title projectId status')
      .populate('designer', 'fullName email phone')
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      data: designs
    });

  } catch (error) {
    console.error('Get designs error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching designs',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

// @desc    Get single design details
// @route   GET /api/user/designs/:id
// @access  Private
exports.getDesignDetails = async (req, res) => {
  try {
    const customer = await User.findById(req.user.id);

    if (!customer) {
      return res.status(404).json({
        success: false,
        message: 'Customer profile not found'
      });
    }

    const design = await Design.findById(req.params.id)
      .populate('project', 'title projectId customer')
      .populate('designer', 'fullName email phone');

    if (!design) {
      return res.status(404).json({
        success: false,
        message: 'Design not found'
      });
    }

    // Verify that this design belongs to the customer's (user's) project
    if (design.project.customer.toString() !== req.user.id.toString()) {
      return res.status(403).json({
        success: false,
        message: 'You do not have access to this design'
      });
    }

    res.status(200).json({
      success: true,
      data: design
    });

  } catch (error) {
    console.error('Get design details error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching design details',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

// @desc    Approve a design
// @route   PUT /api/user/designs/:id/approve
// @access  Private
exports.approveDesign = async (req, res) => {
  try {
    const customer = await User.findById(req.user.id);

    if (!customer) {
      return res.status(404).json({
        success: false,
        message: 'Customer profile not found'
      });
    }

    const design = await Design.findById(req.params.id).populate('project');

    if (!design) {
      return res.status(404).json({
        success: false,
        message: 'Design not found'
      });
    }

    // Verify ownership
    if (design.project.customer.toString() !== req.user.id.toString()) {
      return res.status(403).json({
        success: false,
        message: 'You do not have permission to approve this design'
      });
    }

    // Update design approval status
    design.approvalStatus = 'approved';
    design.status = 'approved';
    design.approvedBy = req.user.id;
    design.approvedAt = new Date();

    await design.save();

    // Update project status to approved if needed
    const project = await Project.findById(design.project._id);
    if (project.status === 'approval_pending') {
      project.status = 'approved';
      await project.save();
    }

    res.status(200).json({
      success: true,
      message: 'Design approved successfully',
      data: design
    });

  } catch (error) {
    console.error('Approve design error:', error);
    res.status(500).json({
      success: false,
      message: 'Error approving design',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

// @desc    Reject a design
// @route   PUT /api/user/designs/:id/reject
// @access  Private
exports.rejectDesign = async (req, res) => {
  try {
    const { rejectionReason } = req.body;

    if (!rejectionReason) {
      return res.status(400).json({
        success: false,
        message: 'Please provide a reason for rejection'
      });
    }

    const customer = await User.findById(req.user.id);

    if (!customer) {
      return res.status(404).json({
        success: false,
        message: 'Customer profile not found'
      });
    }

    const design = await Design.findById(req.params.id).populate('project');

    if (!design) {
      return res.status(404).json({
        success: false,
        message: 'Design not found'
      });
    }

    // Verify ownership
    if (design.project.customer.toString() !== req.user.id.toString()) {
      return res.status(403).json({
        success: false,
        message: 'You do not have permission to reject this design'
      });
    }

    // Update design rejection status
    design.approvalStatus = 'rejected';
    design.status = 'rejected';
    design.rejectionReason = rejectionReason;
    design.approvedBy = req.user.id;
    design.approvedAt = new Date();

    await design.save();

    res.status(200).json({
      success: true,
      message: 'Design rejected successfully',
      data: design
    });

  } catch (error) {
    console.error('Reject design error:', error);
    res.status(500).json({
      success: false,
      message: 'Error rejecting design',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

// @desc    Add comment to design
// @route   POST /api/user/designs/:id/comment
// @access  Private
exports.addDesignComment = async (req, res) => {
  try {
    const { comment } = req.body;

    if (!comment) {
      return res.status(400).json({
        success: false,
        message: 'Please provide a comment'
      });
    }

    const customer = await User.findById(req.user.id);

    if (!customer) {
      return res.status(404).json({
        success: false,
        message: 'Customer profile not found'
      });
    }

    const design = await Design.findById(req.params.id).populate('project');

    if (!design) {
      return res.status(404).json({
        success: false,
        message: 'Design not found'
      });
    }

    // Verify ownership
    if (design.project.customer.toString() !== req.user.id.toString()) {
      return res.status(403).json({
        success: false,
        message: 'You do not have permission to comment on this design'
      });
    }

    // Add comment
    design.customerComments.push({
      comment,
      commentedAt: new Date()
    });

    await design.save();

    res.status(200).json({
      success: true,
      message: 'Comment added successfully',
      data: design
    });

  } catch (error) {
    console.error('Add comment error:', error);
    res.status(500).json({
      success: false,
      message: 'Error adding comment',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

// @desc    Update user profile
// @route   PUT /api/user/profile
// @access  Private
exports.updateUserProfile = async (req, res) => {
  try {
    const { fullName, phone, address } = req.body;

    const customer = await User.findById(req.user.id);

    if (!customer) {
      return res.status(404).json({
        success: false,
        message: 'Customer profile not found'
      });
    }

    // Update fields
    if (fullName) customer.fullName = fullName;
    if (phone) customer.phone = phone;
    if (address) customer.address = { ...customer.address, ...address };

    await customer.save();

    res.status(200).json({
      success: true,
      message: 'Profile updated successfully',
      data: customer
    });

  } catch (error) {
    console.error('Update user profile error:', error);
    res.status(500).json({
      success: false,
      message: 'Error updating profile',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};
