const mongoose = require('mongoose');

const onDemandBookingSchema = new mongoose.Schema({
  bookingId: {
    type: String,
    unique: true
  },
  service: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'OnDemandService',
    required: true
  },
  customer: {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
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
    alternatePhone: String
  },
  serviceAddress: {
    addressLine1: {
      type: String,
      required: true
    },
    addressLine2: String,
    landmark: String,
    city: {
      type: String,
      required: true
    },
    state: {
      type: String,
      required: true
    },
    pincode: {
      type: String,
      required: true
    },
    location: {
      type: {
        type: String,
        enum: ['Point'],
        default: 'Point'
      },
      coordinates: {
        type: [Number],
        index: '2dsphere'
      }
    }
  },
  scheduledDate: {
    type: Date,
    required: true
  },
  timeSlot: {
    start: {
      type: String,
      required: true
    },
    end: {
      type: String,
      required: true
    }
  },
  serviceProvider: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'ServiceProvider'
  },
  serviceDetails: {
    description: String,
    requirements: [String],
    specialInstructions: String,
    images: [{
      url: String,
      description: String,
      uploadedAt: Date
    }]
  },
  pricing: {
    serviceCharge: {
      type: Number,
      required: true,
      default: 0
    },
    materials: {
      type: Number,
      default: 0
    },
    tax: {
      type: Number,
      default: 0
    },
    discount: {
      type: Number,
      default: 0
    },
    couponCode: String,
    couponDiscount: {
      type: Number,
      default: 0
    },
    total: {
      type: Number,
      required: true
    },
    advancePaid: {
      type: Number,
      default: 0
    },
    remainingAmount: {
      type: Number,
      default: 0
    }
  },
  payment: {
    method: {
      type: String,
      enum: ['cash', 'card', 'upi', 'netbanking', 'wallet'],
      default: 'cash'
    },
    status: {
      type: String,
      enum: ['pending', 'partial', 'completed', 'refunded', 'failed'],
      default: 'pending'
    },
    transactionId: String,
    paidAt: Date,
    refundAmount: Number,
    refundReason: String,
    refundedAt: Date
  },
  status: {
    type: String,
    enum: [
      'pending',              // Booking created, awaiting assignment
      'confirmed',            // Service provider assigned
      'provider_on_way',      // Provider is traveling to location
      'in_progress',          // Work has started
      'work_completed',       // Work finished, awaiting payment
      'completed',            // Payment done, booking closed
      'cancelled_by_customer', // Customer cancelled
      'cancelled_by_provider', // Provider cancelled
      'cancelled_by_admin',    // Admin cancelled
      'no_show_customer',      // Customer didn't show up
      'no_show_provider',      // Provider didn't show up
      'rescheduled'            // Booking rescheduled
    ],
    default: 'pending'
  },
  statusHistory: [{
    status: String,
    timestamp: {
      type: Date,
      default: Date.now
    },
    updatedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    notes: String
  }],
  providerArrival: {
    estimatedTime: Date,
    actualTime: Date
  },
  workDuration: {
    startTime: Date,
    endTime: Date,
    actualDuration: Number // in minutes
  },
  rating: {
    customerToProvider: {
      rating: {
        type: Number,
        min: 1,
        max: 5
      },
      review: String,
      ratedAt: Date
    },
    providerToCustomer: {
      rating: {
        type: Number,
        min: 1,
        max: 5
      },
      review: String,
      ratedAt: Date
    }
  },
  otp: {
    code: String,
    verified: {
      type: Boolean,
      default: false
    },
    verifiedAt: Date
  },
  completionOTP: {
    code: {
      type: String,
      select: false
    },
    generatedAt: Date,
    expiresAt: Date,
    verified: {
      type: Boolean,
      default: false
    },
    verifiedAt: Date
  },
  cancellation: {
    cancelledBy: {
      type: String,
      enum: ['customer', 'provider', 'admin']
    },
    reason: String,
    cancelledAt: Date,
    refundEligible: {
      type: Boolean,
      default: false
    }
  },
  rescheduleHistory: [{
    previousDate: Date,
    previousTimeSlot: {
      start: String,
      end: String
    },
    newDate: Date,
    newTimeSlot: {
      start: String,
      end: String
    },
    reason: String,
    rescheduledBy: {
      type: String,
      enum: ['customer', 'provider', 'admin']
    },
    rescheduledAt: {
      type: Date,
      default: Date.now
    }
  }],
  communications: [{
    type: {
      type: String,
      enum: ['sms', 'email', 'push_notification', 'whatsapp', 'call']
    },
    message: String,
    sentTo: {
      type: String,
      enum: ['customer', 'provider', 'both']
    },
    sentAt: {
      type: Date,
      default: Date.now
    },
    status: {
      type: String,
      enum: ['sent', 'delivered', 'failed']
    }
  }],
  notes: String,
  internalNotes: String,
  attachments: [{
    name: String,
    url: String,
    type: String,
    uploadedBy: {
      type: String,
      enum: ['customer', 'provider', 'admin']
    },
    uploadedAt: {
      type: Date,
      default: Date.now
    }
  }],
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
onDemandBookingSchema.pre('save', async function(next) {
  if (!this.bookingId) {
    const count = await mongoose.models.OnDemandBooking.countDocuments();
    this.bookingId = `OD-BK-${String(count + 1).padStart(6, '0')}`;
  }
  next();
});

// Add status to history when status changes
onDemandBookingSchema.pre('save', function(next) {
  if (this.isModified('status')) {
    this.statusHistory.push({
      status: this.status,
      timestamp: new Date(),
      updatedBy: this.lastModifiedBy
    });
  }
  next();
});

// Calculate remaining amount
onDemandBookingSchema.pre('save', function(next) {
  this.pricing.remainingAmount = this.pricing.total - this.pricing.advancePaid;
  next();
});

// Add text index for search
onDemandBookingSchema.index({
  bookingId: 'text',
  'customer.name': 'text',
  'customer.email': 'text',
  'customer.phone': 'text'
});

// Index for filtering and sorting
onDemandBookingSchema.index({ status: 1, scheduledDate: 1 });
onDemandBookingSchema.index({ serviceProvider: 1, status: 1 });
onDemandBookingSchema.index({ 'customer.userId': 1, scheduledDate: -1 });
onDemandBookingSchema.index({ scheduledDate: 1, 'timeSlot.start': 1 });

const OnDemandBooking = mongoose.model('OnDemandBooking', onDemandBookingSchema);

module.exports = OnDemandBooking;
