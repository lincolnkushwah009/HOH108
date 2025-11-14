const mongoose = require('mongoose');

const projectSchema = new mongoose.Schema({
  projectId: {
    type: String,
    unique: true,
    sparse: true // Allows null/undefined during creation before pre-save hook runs
  },
  title: {
    type: String,
    required: [true, 'Project title is required']
  },
  description: String,
  customer: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  assignedDesigner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Employee'
  },
  assignedCRM: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Employee'
  },
  serviceType: {
    type: String,
    required: [true, 'Service type is required'],
    enum: ['interior', 'construction', 'renovation', 'on_demand'],
    default: 'interior'
  },
  projectType: {
    type: String,
    enum: ['residential', 'commercial', 'office', 'hospitality', 'industrial', 'landscape', 'full_home', 'modular_kitchen', 'interior_design'],
    required: true
  },
  roomTypes: [String], // ['kitchen', 'bedroom', 'living_room', etc.]
  carpetArea: {
    type: Number, // in sq ft
    required: true
  },
  budget: {
    estimated: Number,
    actual: Number,
    currency: { type: String, default: 'INR' }
  },
  location: {
    address: String,
    city: String,
    state: String,
    zipCode: String
  },
  timeline: {
    startDate: Date,
    expectedEndDate: Date,
    actualEndDate: Date
  },
  status: {
    type: String,
    enum: [
      'inquiry',
      'design_done',
      'budget_approved',
      'stage1_fee_paid',
      'material_procurement_done',
      'factory_production_started',
      'factory_production_completed',
      'dispatched',
      'delivered',
      'onsite_execution_started',
      'onsite_execution_completed',
      'handover_move_in',
      'on_hold',
      'cancelled'
    ],
    default: 'inquiry'
  },
  designs: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Design'
  }],
  milestones: [{
    name: String,
    description: String,
    status: {
      type: String,
      enum: ['pending', 'in_progress', 'completed'],
      default: 'pending'
    },
    dueDate: Date,
    completedDate: Date,
    payment: {
      percentage: Number,
      amount: Number,
      status: {
        type: String,
        enum: ['pending', 'received'],
        default: 'pending'
      }
    }
  }],
  documents: [{
    name: String,
    type: String,
    url: String,
    uploadedAt: { type: Date, default: Date.now }
  }],
  designImages: [{
    filename: String,
    originalName: String,
    path: String,
    relativePath: String,
    size: Number,
    uploadedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    uploadedAt: { type: Date, default: Date.now },
    description: String
  }],
  notes: String
}, {
  timestamps: true
});

// Auto-generate projectId
projectSchema.pre('save', async function(next) {
  if (!this.projectId) {
    const count = await mongoose.model('Project').countDocuments();
    this.projectId = `PRJ${String(count + 1).padStart(6, '0')}`;
  }
  next();
});

const Project = mongoose.model('Project', projectSchema);

module.exports = Project;
