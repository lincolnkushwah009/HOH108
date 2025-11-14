const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  fullName: {
    type: String,
    required: [true, 'Full name is required'],
    trim: true,
    minlength: [2, 'Name must be at least 2 characters long']
  },
  email: {
    type: String,
    required: [true, 'Email is required'],
    unique: true,
    lowercase: true,
    trim: true,
    match: [/^\S+@\S+\.\S+$/, 'Please enter a valid email address']
  },
  phone: {
    type: String,
    required: [true, 'Phone number is required'],
    match: [/^\d{10,11}$/, 'Phone number must be 10-11 digits']
  },
  password: {
    type: String,
    required: [true, 'Password is required'],
    minlength: [6, 'Password must be at least 6 characters long'],
    select: false // Don't include password in queries by default
  },
  role: {
    type: String,
    enum: [
      'user',              // Regular customer
      'super_admin',       // Access to all verticals
      'interior_admin',    // Interior vertical only
      'construction_admin',// Construction vertical only
      'renovation_admin',  // Renovation vertical only
      'on_demand_admin',   // On-demand vertical only
      'manager',           // Team manager (vertical-specific)
      'designer',          // Designer (vertical-specific)
      'crm'               // CRM executive (vertical-specific)
    ],
    default: 'user'
  },
  verticals: [{
    type: String,
    enum: ['interior', 'construction', 'renovation', 'on_demand']
  }],
  serviceType: {
    type: String,
    enum: ['interior', 'construction', 'renovation', 'on_demand'],
    // Only required for non-super_admin roles
    required: function() {
      return this.role !== 'user' && this.role !== 'super_admin';
    }
  },
  permissions: [{
    type: String,
    enum: [
      'view_users', 'create_users', 'edit_users', 'delete_users',
      'view_employees', 'create_employees', 'edit_employees', 'delete_employees',
      'view_customers', 'create_customers', 'edit_customers', 'delete_customers',
      'view_projects', 'create_projects', 'edit_projects', 'delete_projects',
      'view_designs', 'create_designs', 'edit_designs', 'delete_designs', 'approve_designs',
      'view_dashboard', 'manage_roles', 'manage_permissions'
    ]
  }],
  status: {
    type: String,
    enum: ['active', 'inactive', 'suspended'],
    default: 'active'
  },
  isActive: {
    type: Boolean,
    default: true
  },
  lastLogin: {
    type: Date
  },

  // Customer-specific fields (only for role='user')
  customerId: {
    type: String,
    unique: true,
    sparse: true // Allows null for non-customers
  },
  address: {
    street: String,
    city: String,
    state: String,
    zipCode: String,
    country: { type: String, default: 'India' }
  },
  kycStatus: {
    type: String,
    enum: ['not_submitted', 'pending', 'verified', 'rejected'],
    default: 'not_submitted'
  },
  kycDocuments: [{
    documentType: {
      type: String,
      enum: ['aadhar', 'pan', 'passport', 'driving_license', 'voter_id']
    },
    documentNumber: String,
    frontImage: String,  // URL or path to front image
    backImage: String,   // URL or path to back image (if applicable)
    uploadedAt: { type: Date, default: Date.now },
    verifiedAt: Date,
    verifiedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    }
  }],
  kycRejectionReason: String,
  kycSubmittedAt: Date,
  kycVerifiedAt: Date,
  assignedCRM: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Employee'
  },
  assignedDesigner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Employee'
  },
  projects: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Project'
  }],
  notes: String
}, {
  timestamps: true // Adds createdAt and updatedAt automatically
});

// Hash password and generate customerId before saving
userSchema.pre('save', async function(next) {
  try {
    // Hash password if it's new or modified
    if (this.isModified('password')) {
      const salt = await bcrypt.genSalt(10);
      this.password = await bcrypt.hash(this.password, salt);
    }

    // Auto-generate customerId for users with role 'user'
    if (this.role === 'user' && !this.customerId) {
      const count = await mongoose.model('User').countDocuments({ role: 'user' });
      this.customerId = `CUST${String(count + 1).padStart(6, '0')}`;
    }

    next();
  } catch (error) {
    next(error);
  }
});

// Method to compare passwords
userSchema.methods.comparePassword = async function(candidatePassword) {
  try {
    return await bcrypt.compare(candidatePassword, this.password);
  } catch (error) {
    throw new Error('Password comparison failed');
  }
};

// Method to get public user data (without sensitive info)
userSchema.methods.toJSON = function() {
  const user = this.toObject();
  delete user.password;
  return user;
};

// Method to check if user has access to a specific vertical
userSchema.methods.hasVerticalAccess = function(vertical) {
  // Super admin has access to all verticals
  if (this.role === 'super_admin') {
    return true;
  }

  // Check if user's role matches the vertical
  const verticalRoleMap = {
    'interior': 'interior_admin',
    'construction': 'construction_admin',
    'renovation': 'renovation_admin',
    'on_demand': 'on_demand_admin'
  };

  if (this.role === verticalRoleMap[vertical]) {
    return true;
  }

  // Check if vertical is in user's verticals array
  if (this.verticals && this.verticals.includes(vertical)) {
    return true;
  }

  // Check if user's serviceType matches
  if (this.serviceType === vertical) {
    return true;
  }

  return false;
};

// Method to get user's accessible verticals
userSchema.methods.getAccessibleVerticals = function() {
  if (this.role === 'super_admin') {
    return ['interior', 'construction', 'renovation', 'on_demand'];
  }

  const verticalRoleMap = {
    'interior_admin': ['interior'],
    'construction_admin': ['construction'],
    'renovation_admin': ['renovation'],
    'on_demand_admin': ['on_demand']
  };

  if (verticalRoleMap[this.role]) {
    return verticalRoleMap[this.role];
  }

  if (this.verticals && this.verticals.length > 0) {
    return this.verticals;
  }

  if (this.serviceType) {
    return [this.serviceType];
  }

  return [];
};

// Export existing model if already compiled, otherwise create new one
module.exports = mongoose.models.User || mongoose.model('User', userSchema);
