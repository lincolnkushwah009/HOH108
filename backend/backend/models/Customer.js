const mongoose = require('mongoose');

const customerSchema = new mongoose.Schema({
  customerId: {
    type: String,
    unique: true,
    sparse: true // Allows null/undefined during creation before pre-save hook runs
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  fullName: {
    type: String,
    required: [true, 'Full name is required']
  },
  email: {
    type: String,
    required: [true, 'Email is required'],
    lowercase: true
  },
  phone: {
    type: String,
    required: [true, 'Phone number is required']
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
    enum: ['pending', 'verified', 'rejected'],
    default: 'pending'
  },
  kycDocuments: [{
    documentType: {
      type: String,
      enum: ['aadhar', 'pan', 'passport', 'driving_license']
    },
    documentNumber: String,
    documentUrl: String,
    verifiedAt: Date
  }],
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
  status: {
    type: String,
    enum: ['active', 'inactive', 'blacklisted'],
    default: 'active'
  },
  notes: String
}, {
  timestamps: true
});

// Auto-generate customerId before saving
customerSchema.pre('save', async function(next) {
  if (!this.customerId) {
    const count = await mongoose.model('Customer').countDocuments();
    this.customerId = `CUST${String(count + 1).padStart(6, '0')}`;
  }
  next();
});

const Customer = mongoose.model('Customer', customerSchema);

module.exports = Customer;
