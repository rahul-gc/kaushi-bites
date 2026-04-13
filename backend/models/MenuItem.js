const mongoose = require('mongoose');

const menuItemSchema = new mongoose.Schema({
  id: {
    type: String,
    required: true,
    unique: true
  },
  name: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    required: true
  },
  price: {
    type: Number,
    required: true,
    min: 0
  },
  category: {
    type: String,
    required: true,
    ref: 'Category'
  },
  image: {
    type: String,
    required: true
  },
  rating: {
    type: Number,
    default: 0,
    min: 0,
    max: 5
  },
  badge: {
    type: String,
    trim: true
  },
  isAvailable: {
    type: Boolean,
    default: true
  },
  isFeatured: {
    type: Boolean,
    default: false
  }
}, {
  timestamps: true
});

// Pre-save middleware to generate id
menuItemSchema.pre('save', function(next) {
  if (!this.id) {
    this.id = new mongoose.Types.ObjectId().toString();
  }
  next();
});

// Index for better query performance
menuItemSchema.index({ category: 1 });
menuItemSchema.index({ isAvailable: 1 });
menuItemSchema.index({ isFeatured: 1 });

module.exports = mongoose.model('MenuItem', menuItemSchema);
