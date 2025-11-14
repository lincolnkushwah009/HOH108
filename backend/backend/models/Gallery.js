const mongoose = require('mongoose');

/**
 * Gallery Schema
 * Represents a design project in the gallery
 * Used to showcase completed interior design work
 */
const gallerySchema = new mongoose.Schema({
  imageUrl: {
    type: String,
    required: [true, 'Image URL is required'],
    trim: true
  },
  category: {
    type: String,
    required: [true, 'Category is required'],
    trim: true,
    // Common categories: Kitchen, Bedroom, Living Room, Bathroom, etc.
  },
  title: {
    type: String,
    required: [true, 'Title is required'],
    trim: true
  },
  description: {
    type: String,
    required: [true, 'Description is required'],
    trim: true
  }
}, {
  timestamps: true // Automatically adds createdAt and updatedAt fields
});

// Create and export the Gallery model
const Gallery = mongoose.model('Gallery', gallerySchema);

module.exports = Gallery;
