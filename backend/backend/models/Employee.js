const mongoose = require('mongoose');

const employeeSchema = new mongoose.Schema({
  employeeId: {
    type: String,
    required: [true, 'Employee ID is required'],
    unique: true,
    trim: true
  },
  fullName: {
    type: String,
    required: [true, 'Full name is required'],
    trim: true
  },
  email: {
    type: String,
    required: [true, 'Email is required'],
    unique: true,
    lowercase: true,
    trim: true
  },
  phone: {
    type: String,
    required: [true, 'Phone number is required'],
    trim: true
  },
  role: {
    type: String,
    required: [true, 'Role is required'],
    enum: ['designer', 'crm', 'manager', 'sales', 'support'],
    default: 'designer'
  },
  department: {
    type: String,
    required: true,
    enum: ['design', 'sales', 'support', 'management']
  },
  serviceType: {
    type: String,
    required: [true, 'Service type is required'],
    enum: ['interior', 'construction', 'renovation', 'on_demand'],
    default: 'interior'
  },
  status: {
    type: String,
    enum: ['active', 'inactive', 'on-leave'],
    default: 'active'
  },
  joiningDate: {
    type: Date,
    default: Date.now
  },
  salary: {
    type: Number
  },
  address: {
    street: String,
    city: String,
    state: String,
    pincode: String,
    country: { type: String, default: 'India' }
  },
  specialization: {
    type: String,
    enum: ['residential', 'commercial', 'industrial', 'landscape', 'full_home', 'modular_kitchen', 'interior_design']
  },
  bio: {
    type: String
  },
  portfolio: {
    behance: String,
    dribbble: String,
    instagram: String,
    website: String
  },
  assignedProjects: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Project'
  }]
}, {
  timestamps: true
});

// Index for faster queries (employeeId and email already have unique indexes)
employeeSchema.index({ role: 1, status: 1 });

// Export existing model if already compiled, otherwise create new one
module.exports = mongoose.models.Employee || mongoose.model('Employee', employeeSchema);
