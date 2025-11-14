const mongoose = require('mongoose');

const renovationBookingSchema = new mongoose.Schema({
  bookingId: {
    type: String,
    unique: true,
    required: true
  },
  service: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'RenovationService',
    required: true
  },
  customer: {
    name: {
      type: String,
      required: true
    },
    email: {
      type: String,
      required: true
    },
    phone: {
      type: String,
      required: true
    },
    address: {
      street: String,
      city: String,
      state: String,
      pincode: String
    }
  },
  propertyDetails: {
    type: {
      type: String,
      enum: ['Residential', 'Commercial', 'Industrial'],
      required: true
    },
    area: {
      type: Number,
      required: true
    },
    unit: {
      type: String,
      enum: ['sqft', 'sqm'],
      default: 'sqft'
    },
    floors: Number,
    rooms: Number,
    currentCondition: {
      type: String,
      enum: ['Excellent', 'Good', 'Average', 'Poor', 'Very Poor']
    }
  },
  requirements: {
    description: {
      type: String,
      required: true
    },
    budget: {
      min: Number,
      max: Number
    },
    preferredStartDate: Date,
    urgency: {
      type: String,
      enum: ['Immediate', 'Within 1 Month', 'Within 3 Months', 'Flexible'],
      default: 'Flexible'
    },
    specificRequirements: [String]
  },
  estimatedCost: {
    type: Number,
    default: 0
  },
  quotation: {
    amount: Number,
    breakdown: [{
      item: String,
      cost: Number
    }],
    validUntil: Date,
    notes: String
  },
  status: {
    type: String,
    enum: [
      'pending',           // Initial booking
      'quote_requested',   // Customer requested quote
      'quote_sent',        // Quote sent to customer
      'quote_approved',    // Customer approved quote
      'scheduled',         // Work scheduled
      'in_progress',       // Work ongoing
      'inspection',        // Final inspection
      'completed',         // Work completed
      'cancelled',         // Booking cancelled
      'on_hold'           // Temporarily paused
    ],
    default: 'pending'
  },
  assignedTo: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  scheduledDate: Date,
  completionDate: Date,
  actualCompletionDate: Date,
  notes: String,
  internalNotes: String,
  attachments: [{
    name: String,
    url: String,
    type: String,
    uploadedAt: Date
  }],
  timeline: [{
    status: String,
    date: Date,
    notes: String,
    updatedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    }
  }],
  rating: {
    value: {
      type: Number,
      min: 1,
      max: 5
    },
    review: String,
    ratedAt: Date
  },
  priority: {
    type: String,
    enum: ['Low', 'Medium', 'High', 'Urgent'],
    default: 'Medium'
  },
  source: {
    type: String,
    enum: ['Website', 'Mobile App', 'Phone', 'Walk-in', 'Referral', 'Other'],
    default: 'Website'
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

// Auto-generate bookingId before saving
renovationBookingSchema.pre('save', async function(next) {
  if (!this.bookingId) {
    const count = await mongoose.models.RenovationBooking.countDocuments();
    this.bookingId = `REN-BK-${String(count + 1).padStart(5, '0')}`;
  }
  next();
});

// Add timeline entry when status changes
renovationBookingSchema.pre('save', function(next) {
  if (this.isModified('status')) {
    this.timeline.push({
      status: this.status,
      date: new Date(),
      updatedBy: this.lastModifiedBy
    });
  }
  next();
});

// Add text index for search
renovationBookingSchema.index({
  bookingId: 'text',
  'customer.name': 'text',
  'customer.email': 'text',
  'customer.phone': 'text'
});

const RenovationBooking = mongoose.model('RenovationBooking', renovationBookingSchema);

module.exports = RenovationBooking;
