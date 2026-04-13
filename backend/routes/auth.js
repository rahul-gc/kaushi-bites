const express = require('express');
const jwt = require('jsonwebtoken');
const { body, validationResult } = require('express-validator');
const { User } = require('../models/SupabaseModels');
const { protect } = require('../middleware/auth');

const router = express.Router();

// Generate JWT Token
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRE,
  });
};

// @route   POST /api/auth/register
// @desc    Register a new user
router.post('/register', [
  body('name').trim().isLength({ min: 2 }).withMessage('Name must be at least 2 characters'),
  body('email').isEmail().normalizeEmail().withMessage('Please provide a valid email'),
  body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters'),
], async (req, res) => {
  try {
    // Check for validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ 
        message: 'Validation failed', 
        errors: errors.array() 
      });
    }

    const { name, email, password, phone } = req.body;

    // Check if user already exists
    const existingUser = await User.findByEmail(email);
    if (existingUser) {
      return res.status(400).json({ message: 'User already exists with this email' });
    }

    // Create new user
    const bcrypt = require('bcryptjs');
    const hashedPassword = await bcrypt.hash(password, 12);
    
    const user = await User.create({
      id: email,
      name,
      email,
      password: hashedPassword,
      phone
    });

    // Generate token
    const token = generateToken(user.id);

    // Return user profile without password
    const userProfile = {
      id: user.id,
      name: user.name,
      email: user.email,
      phone: user.phone,
      createdAt: user.created_at
    };

    res.status(201).json({
      message: 'User registered successfully',
      token,
      user: userProfile
    });
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ message: 'Server error during registration' });
  }
});

// @route   POST /api/auth/login
// @desc    Login user
router.post('/login', [
  body('email').isEmail().normalizeEmail().withMessage('Please provide a valid email'),
  body('password').notEmpty().withMessage('Password is required'),
], async (req, res) => {
  try {
    // Check for validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ 
        message: 'Validation failed', 
        errors: errors.array() 
      });
    }

    const { email, password } = req.body;

    // Find user by email
    const user = await User.findByEmail(email);
    if (!user) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    // Check password
    const bcrypt = require('bcryptjs');
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    // Generate token
    const token = generateToken(user.id);

    // Return user profile without password
    const userProfile = {
      id: user.id,
      name: user.name,
      email: user.email,
      phone: user.phone,
      createdAt: user.created_at
    };

    res.json({
      message: 'Login successful',
      token,
      user: userProfile
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ message: 'Server error during login' });
  }
});

// @route   GET /api/auth/me
// @desc    Get current user profile
router.get('/me', protect, async (req, res) => {
  const user = await User.findById(req.user.id);
  const userProfile = {
    id: user.id,
    name: user.name,
    email: user.email,
    phone: user.phone,
    createdAt: user.created_at
  };
  
  res.json({
    user: userProfile
  });
});

// @route   PUT /api/auth/profile
// @desc    Update user profile
router.put('/profile', protect, [
  body('name').optional().trim().isLength({ min: 2 }).withMessage('Name must be at least 2 characters'),
  body('phone').optional().trim().isMobilePhone('any').withMessage('Please provide a valid phone number'),
], async (req, res) => {
  try {
    // Check for validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ 
        message: 'Validation failed', 
        errors: errors.array() 
      });
    }

    const { name, phone } = req.body;
    const updateData = {};
    
    if (name) updateData.name = name;
    if (phone) updateData.phone = phone;

    const updatedUser = await User.update(req.user.id, updateData);
    
    const userProfile = {
      id: updatedUser.id,
      name: updatedUser.name,
      email: updatedUser.email,
      phone: updatedUser.phone,
      createdAt: updatedUser.created_at
    };

    res.json({
      message: 'Profile updated successfully',
      user: userProfile
    });
  } catch (error) {
    console.error('Profile update error:', error);
    res.status(500).json({ message: 'Server error during profile update' });
  }
});

module.exports = router;
