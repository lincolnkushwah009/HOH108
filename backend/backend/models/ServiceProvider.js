const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const serviceProviderSchema = new mongoose.Schema({
  providerId: {
    type: String,
    unique: true
  },
  fullName: {
    type: String,
    required: true,
    trim: true
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true
  },
  phone: {
    type: String,
    required: true,
    trim: true
  },
  password: {
    type: String,
    required: true,
    select: false
  },
  role: {
    type: String,
    default: 'service_provider'
  },
  alternatePhone: {
    type: String
  },
  profileImage: {
    type: String
  },
  address: {
    street: String,
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
    country: {
      type: String,
      default: 'India'
    }
  },
  serviceAreas: [{
    city: String,
    pincodes: [String]
  }],
  services: [{
    service: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'OnDemandService',
      required: true
    },
    specialization: String,
    experienceYears: Number
  }],
  skills: [{
    type: String
  }],
  experience: {
    years: {
      type: Number,
      required: true,
      default: 0
    },
    description: String
  },
  certifications: [{
    name: String,
    issuedBy: String,
    issuedDate: Date,
    expiryDate: Date,
    certificateUrl: String
  }],
  documents: {
    aadharCard: {
      number: String,
      verified: { type: Boolean, default: false },
      documentUrl: String
    },
    panCard: {
      number: String,
      verified: { type: Boolean, default: false },
      documentUrl: String
    },
    drivingLicense: {
      number: String,
      verified: { type: Boolean, default: false },
      documentUrl: String
    },
    policeClearance: {
      verified: { type: Boolean, default: false },
      documentUrl: String,
      validUntil: Date
    }
  },
  availability: {
    status: {
      type: String,
      enum: ['available', 'busy', 'unavailable', 'on_leave'],
      default: 'available'
    },
    workingDays: [{
      type: String,
      enum: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday']
    }],
    workingHours: {
      start: String,
      end: String
    },
    unavailableDates: [{
      from: Date,
      to: Date,
      reason: String
    }]
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
  reviews: [{
    customer: {
      name: String,
      email: String
    },
    booking: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'OnDemandBooking'
    },
    rating: {
      type: Number,
      min: 1,
      max: 5
    },
    review: String,
    response: String,
    createdAt: {
      type: Date,
      default: Date.now
    }
  }],
  performance: {
    totalBookings: {
      type: Number,
      default: 0
    },
    completedBookings: {
      type: Number,
      default: 0
    },
    cancelledBookings: {
      type: Number,
      default: 0
    },
    onTimeCompletions: {
      type: Number,
      default: 0
    },
    averageResponseTime: {
      type: Number,
      default: 0
    },
    completionRate: {
      type: Number,
      default: 0
    }
  },
  earnings: {
    totalEarned: {
      type: Number,
      default: 0
    },
    currentMonthEarnings: {
      type: Number,
      default: 0
    },
    pendingPayment: {
      type: Number,
      default: 0
    }
  },
  bankDetails: {
    accountHolderName: String,
    accountNumber: String,
    ifscCode: String,
    bankName: String,
    branchName: String,
    upiId: String
  },
  status: {
    type: String,
    enum: ['pending_verification', 'active', 'inactive', 'suspended', 'blacklisted'],
    default: 'pending_verification'
  },
  verified: {
    email: {
      type: Boolean,
      default: false
    },
    phone: {
      type: Boolean,
      default: false
    },
    documents: {
      type: Boolean,
      default: false
    },
    background: {
      type: Boolean,
      default: false
    }
  },
  onboarding: {
    completedSteps: [{
      type: String
    }],
    currentStep: String,
    completedAt: Date
  },
  preferences: {
    notificationsEnabled: {
      type: Boolean,
      default: true
    },
    emailNotifications: {
      type: Boolean,
      default: true
    },
    smsNotifications: {
      type: Boolean,
      default: true
    }
  },
  notes: String,
  internalNotes: String,
  joiningDate: {
    type: Date,
    default: Date.now
  },
  lastActive: Date,
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

// Auto-generate providerId before saving
serviceProviderSchema.pre('save', async function(next) {
  if (!this.providerId) {
    const count = await mongoose.models.ServiceProvider.countDocuments();
    this.providerId = `PRO-${String(count + 1).padStart(6, '0')}`;
  }
  next();
});

// Hash password before saving
serviceProviderSchema.pre('save', async function(next) {
  if (!this.isModified('password')) {
    return next();
  }

  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error) {
    next(error);
  }
});

// Calculate completion rate before saving
serviceProviderSchema.pre('save', function(next) {
  if (this.performance.totalBookings > 0) {
    this.performance.completionRate =
      (this.performance.completedBookings / this.performance.totalBookings) * 100;
  }
  next();
});

// Method to compare password
serviceProviderSchema.methods.comparePassword = async function(candidatePassword) {
  try {
    return await bcrypt.compare(candidatePassword, this.password);
  } catch (error) {
    throw error;
  }
};

// Add text index for search
serviceProviderSchema.index({
  fullName: 'text',
  email: 'text',
  phone: 'text',
  skills: 'text'
});

// Index for filtering
serviceProviderSchema.index({ status: 1, 'availability.status': 1 });
serviceProviderSchema.index({ 'address.city': 1, 'address.pincode': 1 });
serviceProviderSchema.index({ 'rating.average': -1 });

const ServiceProvider = mongoose.model('ServiceProvider', serviceProviderSchema);

module.exports = ServiceProvider;
