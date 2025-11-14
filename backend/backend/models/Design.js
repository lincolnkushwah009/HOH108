const mongoose = require('mongoose');

const designSchema = new mongoose.Schema({
  designId: {
    type: String,
    required: true,
    unique: true
  },
  project: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Project',
    required: true
  },
  title: {
    type: String,
    required: [true, 'Design title is required']
  },
  description: String,
  version: {
    type: Number,
    default: 1
  },
  designer: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Employee',
    required: true
  },
  roomType: {
    type: String,
    enum: ['kitchen', 'bedroom', 'living_room', 'bathroom', 'dining_room', 'office', 'full_home'],
    required: true
  },
  designFiles: [{
    fileName: String,
    fileType: {
      type: String,
      enum: ['2d', '3d', 'render', 'floor_plan', 'elevation']
    },
    fileUrl: String,
    thumbnail: String,
    uploadedAt: { type: Date, default: Date.now }
  }],
  boq: {
    items: [{
      itemName: String,
      description: String,
      category: {
        type: String,
        enum: ['furniture', 'fixture', 'material', 'labor', 'appliance', 'accessory', 'other']
      },
      quantity: Number,
      unit: String, // sq ft, piece, meter, etc.
      rate: Number,
      amount: Number,
      supplier: String,
      specifications: String
    }],
    subtotal: Number,
    tax: {
      percentage: Number,
      amount: Number
    },
    total: Number,
    currency: { type: String, default: 'INR' }
  },
  approvalStatus: {
    type: String,
    enum: ['pending', 'approved', 'rejected', 'revision_requested'],
    default: 'pending'
  },
  approvedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  approvedAt: Date,
  rejectionReason: String,
  revisionNotes: String,
  customerComments: [{
    comment: String,
    commentedAt: { type: Date, default: Date.now }
  }],
  status: {
    type: String,
    enum: ['draft', 'submitted', 'under_review', 'approved', 'rejected'],
    default: 'draft'
  }
}, {
  timestamps: true
});

// Auto-generate designId
designSchema.pre('save', async function(next) {
  if (!this.designId) {
    const count = await mongoose.model('Design').countDocuments();
    this.designId = `DES${String(count + 1).padStart(6, '0')}`;
  }
  next();
});

const Design = mongoose.model('Design', designSchema);

module.exports = Design;
