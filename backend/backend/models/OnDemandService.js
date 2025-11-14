const mongoose = require('mongoose');

const onDemandServiceSchema = new mongoose.Schema({
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
      'Plumbing',
      'Electrical',
      'Carpentry',
      'Painting',
      'Cleaning',
      'Pest Control',
      'Appliance Repair',
      'AC Service & Repair',
      'Home Automation',
      'CCTV Installation',
      'Salon & Spa',
      'Beauty Services',
      'Massage & Therapy',
      'Other'
    ]
  },
  subcategory: {
    type: String
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
      enum: ['hourly', 'fixed', 'per_unit'],
      default: 'fixed'
    },
    basePrice: {
      type: Number,
      required: true,
      default: 0
    },
    currency: {
      type: String,
      default: 'INR'
    },
    // For hourly pricing
    hourlyRate: Number,
    minHours: Number,
    // For per unit pricing
    unitPrice: Number,
    unitName: String
  },
  duration: {
    estimated: {
      type: Number,
      required: true,
      default: 1
    },
    unit: {
      type: String,
      enum: ['minutes', 'hours', 'days'],
      default: 'hours'
    }
  },
  features: [{
    type: String
  }],
  includedItems: [{
    type: String
  }],
  excludedItems: [{
    type: String
  }],
  requirements: [{
    type: String
  }],
  availability: {
    daysOfWeek: [{
      type: String,
      enum: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday']
    }],
    timeSlots: [{
      start: String,
      end: String
    }],
    advanceBookingDays: {
      type: Number,
      default: 7
    },
    sameDay: {
      type: Boolean,
      default: false
    }
  },
  serviceProviders: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'ServiceProvider'
  }],
  popular: {
    type: Boolean,
    default: false
  },
  trending: {
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
  completedBookings: {
    type: Number,
    default: 0
  },
  rating: {
    average: {
      type: Number,
      default: 0,
      min: 0,
      max: 5
    },
    count: {
      type: Number,
      default: 0
    }
  },
  tags: [{
    type: String
  }],
  seoMetadata: {
    metaTitle: String,
    metaDescription: String,
    keywords: [String]
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
onDemandServiceSchema.pre('save', async function(next) {
  if (!this.serviceId) {
    const count = await mongoose.models.OnDemandService.countDocuments();
    this.serviceId = `OD-SVC-${String(count + 1).padStart(5, '0')}`;
  }
  next();
});

// Add text index for search
onDemandServiceSchema.index({
  title: 'text',
  description: 'text',
  category: 'text',
  subcategory: 'text',
  tags: 'text'
});

// Index for filtering
onDemandServiceSchema.index({ category: 1, active: 1, popular: 1 });
onDemandServiceSchema.index({ 'rating.average': -1 });

const OnDemandService = mongoose.model('OnDemandService', onDemandServiceSchema);

module.exports = OnDemandService;
