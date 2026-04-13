const express = require('express');
const { body, validationResult } = require('express-validator');
const Order = require('../models/Order');
const MenuItem = require('../models/MenuItem');
const Category = require('../models/Category');
const User = require('../models/User');
const { protect, adminOnly } = require('../middleware/auth');

const router = express.Router();

// @route   POST /api/admin/login
// @desc    Admin login
router.post('/login', [
  body('username').trim().notEmpty().withMessage('Username is required'),
  body('password').trim().notEmpty().withMessage('Password is required'),
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

    const { username, password } = req.body;

    // Find admin user
    const adminUser = await User.findOne({ email: username, isAdmin: true });
    if (!adminUser) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    // Check password
    const isPasswordValid = await adminUser.comparePassword(password);
    if (!isPasswordValid) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    // Generate token
    const jwt = require('jsonwebtoken');
    const token = jwt.sign({ id: adminUser.id }, process.env.JWT_SECRET, {
      expiresIn: process.env.JWT_EXPIRE,
    });

    res.json({
      message: 'Admin login successful',
      token,
      user: {
        id: adminUser.id,
        name: adminUser.name,
        email: adminUser.email,
        isAdmin: adminUser.isAdmin
      }
    });
  } catch (error) {
    console.error('Admin login error:', error);
    res.status(500).json({ message: 'Server error during admin login' });
  }
});

// @route   GET /api/admin/overview
// @desc    Get admin overview stats
router.get('/overview', protect, adminOnly, async (req, res) => {
  try {
    // Get basic stats
    const totalOrders = await Order.countDocuments();
    const totalMenuItems = await MenuItem.countDocuments();
    const totalCategories = await Category.countDocuments();
    const totalUsers = await User.countDocuments({ isAdmin: false });

    // Get orders by status
    const ordersByStatus = await Order.aggregate([
      {
        $group: {
          _id: '$status',
          count: { $sum: 1 }
        }
      }
    ]);

    // Get recent orders
    const recentOrders = await Order.find()
      .sort({ createdAt: -1 })
      .limit(5);

    // Get total revenue
    const totalRevenue = await Order.aggregate([
      {
        $match: {
          status: { $ne: 'cancelled' }
        }
      },
      {
        $group: {
          _id: null,
          total: { $sum: '$total' }
        }
      }
    ]);

    // Get today's orders
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    const todayOrders = await Order.countDocuments({
      createdAt: { $gte: today, $lt: tomorrow }
    });

    res.json({
      stats: {
        totalOrders,
        totalMenuItems,
        totalCategories,
        totalUsers,
        todayOrders,
        totalRevenue: totalRevenue[0]?.total || 0
      },
      ordersByStatus: ordersByStatus.reduce((acc, item) => {
        acc[item._id] = item.count;
        return acc;
      }, {}),
      recentOrders
    });
  } catch (error) {
    console.error('Admin overview error:', error);
    res.status(500).json({ message: 'Server error while fetching admin overview' });
  }
});

// @route   GET /api/admin/orders
// @desc    Get all orders (admin)
router.get('/orders', protect, adminOnly, async (req, res) => {
  try {
    const { status, page = 1, limit = 10 } = req.query;
    let filter = {};

    if (status) {
      filter.status = status;
    }

    const orders = await Order.find(filter)
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const total = await Order.countDocuments(filter);

    res.json({
      orders,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    console.error('Get admin orders error:', error);
    res.status(500).json({ message: 'Server error while fetching orders' });
  }
});

// @route   PUT /api/admin/orders/:id/status
// @desc    Update order status
router.put('/orders/:id/status', protect, adminOnly, [
  body('status').isIn(['pending', 'confirmed', 'preparing', 'ready', 'delivered', 'cancelled'])
    .withMessage('Invalid order status'),
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

    const { status } = req.body;
    const order = await Order.findOne({ id: req.params.id });

    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    order.status = status;
    await order.save();

    res.json({
      message: 'Order status updated successfully',
      order
    });
  } catch (error) {
    console.error('Update order status error:', error);
    res.status(500).json({ message: 'Server error while updating order status' });
  }
});

// @route   GET /api/admin/menu-items
// @desc    Get all menu items (admin)
router.get('/menu-items', protect, adminOnly, async (req, res) => {
  try {
    const { page = 1, limit = 20, category, available } = req.query;
    let filter = {};

    if (category && category !== 'all') {
      filter.category = category;
    }
    if (available !== undefined) {
      filter.isAvailable = available === 'true';
    }

    const menuItems = await MenuItem.find(filter)
      .sort({ name: 1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const total = await MenuItem.countDocuments(filter);

    res.json({
      menuItems,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    console.error('Get admin menu items error:', error);
    res.status(500).json({ message: 'Server error while fetching menu items' });
  }
});

// @route   GET /api/admin/users
// @desc    Get all users (admin)
router.get('/users', protect, adminOnly, async (req, res) => {
  try {
    const { page = 1, limit = 20 } = req.query;

    const users = await User.find({ isAdmin: false })
      .select('-password')
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const total = await User.countDocuments({ isAdmin: false });

    res.json({
      users,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    console.error('Get admin users error:', error);
    res.status(500).json({ message: 'Server error while fetching users' });
  }
});

module.exports = router;
