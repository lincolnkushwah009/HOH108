const mongoose = require('mongoose');

/**
 * Lead Schema
 * Represents a potential client inquiry
 * Stores customer contact information and project details
 */
const leadSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Name is required'],
    trim: true
  },
  email: {
    type: String,
    required: [true, 'Email is required'],
    trim: true,
    lowercase: true,
    match: [/^\S+@\S+\.\S+$/, 'Please provide a valid email address']
  },
  phone: {
    type: String,
    trim: true
  },
  city: {
    type: String,
    trim: true
  },
  carpetArea: {
    type: Number,
    min: [1, 'Carpet area must be greater than 0']
  },
  bhk: {
    type: String,
    trim: true
  },
  package: {
    type: String,
    trim: true
  },
  estimatedCost: {
    type: Number,
    min: [0, 'Estimated cost cannot be negative']
  },
  serviceType: {
    type: String,
    required: [true, 'Service type is required'],
    enum: ['interior', 'construction', 'renovation', 'on_demand'],
    default: 'interior'
  },
  leadType: {
    type: String,
    enum: ['general', 'cost_estimate'],
    default: 'general'
  },
  status: {
    type: String,
    enum: ['new', 'rnr', 'qualified', 'lost', 'non_prospect', 'not_reachable', 'low_budget', 'non_serviceable_area', 'future_prospect'],
    default: 'new'
  },
  notes: {
    type: String,
    trim: true
  },
  date: {
    type: Date,
    default: Date.now
  },
  lastModifiedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  history: [{
    action: {
      type: String,
      required: true
    },
    description: {
      type: String,
      required: true
    },
    changedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    changedByName: {
      type: String
    },
    timestamp: {
      type: Date,
      default: Date.now
    },
    changes: {
      type: mongoose.Schema.Types.Mixed
    }
  }]
}, {
  timestamps: true // Automatically adds createdAt and updatedAt fields
});

// Create and export the Lead model
const Lead = mongoose.model('Lead', leadSchema);

module.exports = Lead;
