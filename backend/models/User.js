const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
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
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true
  },
  password: {
    type: String,
    required: true,
    minlength: 6
  },
  phone: {
    type: String,
    trim: true
  },
  isAdmin: {
    type: Boolean,
    default: false
  }
}, {
  timestamps: true
});

// Pre-save middleware to hash password and generate id
userSchema.pre('save', async function(next) {
  if (!this.id) {
    this.id = this.email;
  }
  
  // Only hash the password if it has been modified (or is new)
  if (!this.isModified('password')) return next();
  
  try {
    // Hash password with cost of 12
    this.password = await bcrypt.hash(this.password, 12);
    next();
  } catch (error) {
    next(error);
  }
});

// Method to check password
userSchema.methods.comparePassword = async function(candidatePassword) {
  return bcrypt.compare(candidatePassword, this.password);
};

// Method to get user profile without password
userSchema.methods.toProfileJSON = function() {
  return {
    id: this.id,
    name: this.name,
    email: this.email,
    phone: this.phone,
    createdAt: this.createdAt
  };
};

module.exports = mongoose.model('User', userSchema);
