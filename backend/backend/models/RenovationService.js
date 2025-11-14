const mongoose = require('mongoose');

const renovationServiceSchema = new mongoose.Schema({
  serviceId: {
    type: String,
    unique: true
  },
  title: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    required: true
  },
  category: {
    type: String,
    required: true,
    enum: [
      'Kitchen Renovation',
      'Bathroom Renovation',
      'Living Room Renovation',
      'Bedroom Renovation',
      'Full Home Renovation',
      'Office Renovation',
      'Exterior Renovation',
      'Other'
    ]
  },
  image: {
    type: String,
    required: true
  },
  images: [{
    type: String
  }],
  pricing: {
    type: {
      type: String,
      enum: ['fixed', 'per_sqft', 'custom'],
      default: 'custom'
    },
    basePrice: {
      type: Number,
      default: 0
    },
    minPrice: {
      type: Number
    },
    maxPrice: {
      type: Number
    }
  },
  duration: {
    min: {
      type: Number,
      required: true
    },
    max: {
      type: Number,
      required: true
    },
    unit: {
      type: String,
      enum: ['days', 'weeks', 'months'],
      default: 'days'
    }
  },
  features: [{
    type: String
  }],
  includedServices: [{
    type: String
  }],
  excludedServices: [{
    type: String
  }],
  popular: {
    type: Boolean,
    default: false
  },
  active: {
    type: Boolean,
    default: true
  },
  totalBookings: {
    type: Number,
    default: 0
  },
  rating: {
    average: {
      type: Number,
      default: 0
    },
    count: {
      type: Number,
      default: 0
    }
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  lastModifiedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }
}, {
  timestamps: true
});

// Auto-generate serviceId before saving
renovationServiceSchema.pre('save', async function(next) {
  if (!this.serviceId) {
    const count = await mongoose.models.RenovationService.countDocuments();
    this.serviceId = `REN-SVC-${String(count + 1).padStart(4, '0')}`;
  }
  next();
});

// Add text index for search
renovationServiceSchema.index({ title: 'text', description: 'text', category: 'text' });

const RenovationService = mongoose.model('RenovationService', renovationServiceSchema);

module.exports = RenovationService;
