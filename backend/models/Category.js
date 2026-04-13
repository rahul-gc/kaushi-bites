const mongoose = require('mongoose');

const categorySchema = new mongoose.Schema({
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
  slug: {
    type: String,
    required: true,
    unique: true,
    lowercase: true
  },
  image: {
    type: String,
    required: true
  }
}, {
  timestamps: true
});

// Pre-save middleware to generate id and slug
categorySchema.pre('save', function(next) {
  if (!this.id) {
    this.id = this.slug;
  }
  next();
});

module.exports = mongoose.model('Category', categorySchema);
