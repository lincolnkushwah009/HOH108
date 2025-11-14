const mongoose = require('mongoose');

/**
 * Testimonial Schema
 * Represents a client testimonial/review
 * Used to display customer feedback and ratings
 */
const testimonialSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Client name is required'],
    trim: true
  },
  photo: {
    type: String,
    required: [true, 'Photo URL is required'],
    trim: true
  },
  review: {
    type: String,
    required: [true, 'Review text is required'],
    trim: true
  },
  rating: {
    type: Number,
    required: [true, 'Rating is required'],
    min: [1, 'Rating must be at least 1'],
    max: [5, 'Rating cannot exceed 5'],
    validate: {
      validator: Number.isInteger,
      message: 'Rating must be an integer'
    }
  }
}, {
  timestamps: true // Automatically adds createdAt and updatedAt fields
});

// Create and export the Testimonial model
const Testimonial = mongoose.model('Testimonial', testimonialSchema);

module.exports = Testimonial;
