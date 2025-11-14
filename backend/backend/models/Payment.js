const mongoose = require('mongoose');

const paymentSchema = new mongoose.Schema({
  paymentId: {
    type: String,
    unique: true,
    sparse: true
  },
  project: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Project',
    required: [true, 'Project reference is required']
  },
  customer: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'Customer reference is required']
  },
  serviceType: {
    type: String,
    required: [true, 'Service type is required'],
    enum: ['interior', 'construction', 'renovation', 'on_demand'],
    default: 'interior'
  },
  amount: {
    type: Number,
    required: [true, 'Payment amount is required'],
    min: [0, 'Amount cannot be negative']
  },
  dueDate: {
    type: Date,
    required: [true, 'Due date is required']
  },
  paidDate: {
    type: Date
  },
  status: {
    type: String,
    enum: ['pending', 'partially_paid', 'paid', 'overdue'],
    default: 'pending'
  },
  paymentMethod: {
    type: String,
    enum: ['cash', 'bank_transfer', 'cheque', 'upi', 'card', 'other'],
    default: 'bank_transfer'
  },
  milestone: {
    type: String,
    required: [true, 'Payment milestone is required'],
    enum: ['advance', 'stage_1', 'stage_2', 'stage_3', 'final', 'other']
  },
  description: {
    type: String,
    trim: true
  },
  transactionId: {
    type: String,
    trim: true
  },
  notes: {
    type: String,
    trim: true
  },
  reminders: [{
    date: Date,
    sent: {
      type: Boolean,
      default: false
    },
    method: {
      type: String,
      enum: ['email', 'sms', 'phone', 'whatsapp']
    }
  }],
  collectedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Employee'
  },
  attachments: [{
    name: String,
    url: String,
    uploadedAt: {
      type: Date,
      default: Date.now
    }
  }]
}, {
  timestamps: true
});

// Generate payment ID before saving
paymentSchema.pre('save', async function(next) {
  if (!this.paymentId) {
    const count = await mongoose.model('Payment').countDocuments();
    this.paymentId = `PAY${String(count + 1).padStart(6, '0')}`;
  }

  // Auto-update status based on dates and amounts
  if (this.paidDate && this.status === 'pending') {
    this.status = 'paid';
  }

  // Check if payment is overdue
  if (!this.paidDate && new Date() > this.dueDate && this.status === 'pending') {
    this.status = 'overdue';
  }

  next();
});

// Index for faster queries
paymentSchema.index({ project: 1, status: 1 });
paymentSchema.index({ customer: 1, status: 1 });
paymentSchema.index({ dueDate: 1, status: 1 });
paymentSchema.index({ serviceType: 1, status: 1 });

module.exports = mongoose.model('Payment', paymentSchema);
