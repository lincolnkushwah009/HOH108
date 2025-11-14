const mongoose = require('mongoose');

const blogSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true
  },
  excerpt: {
    type: String,
    required: true
  },
  content: {
    type: String,
    required: true
  },
  image: {
    type: String,
    required: true
  },
  category: {
    type: String,
    required: true,
    enum: ['Design Trends', 'Renovation', 'Tips & Tricks', 'Sustainability', 'Technology', 'Commercial']
  },
  serviceType: {
    type: String,
    enum: ['interior', 'construction', 'renovation', 'on_demand', 'all'],
    default: 'all'
  },
  author: {
    type: String,
    required: true
  },
  authorImage: {
    type: String,
    default: 'https://i.pravatar.cc/150?img=1'
  },
  authorBio: {
    type: String,
    default: 'Interior design expert at HOH 108'
  },
  readTime: {
    type: String,
    default: '5 min read'
  },
  featured: {
    type: Boolean,
    default: false
  },
  tags: [{
    type: String
  }],
  published: {
    type: Boolean,
    default: false
  },
  views: {
    type: Number,
    default: 0
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

// Add text index for search
blogSchema.index({ title: 'text', excerpt: 'text', content: 'text', tags: 'text' });

const Blog = mongoose.model('Blog', blogSchema);

module.exports = Blog;
