const express = require('express');
const { body, validationResult } = require('express-validator');
const { Order, MenuItem, Category, User } = require('../models/SupabaseModels');
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
    const adminUser = await User.findByEmail(username);
    if (!adminUser || !adminUser.is_admin) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    // Check password
    const isPasswordValid = await User.comparePassword(password, adminUser.password);
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
    const totalOrders = await Order.count();
    const totalMenuItems = await MenuItem.count();
    const totalCategories = await Category.count();
    const totalUsers = await User.count();

    // Get all orders for manual aggregation
    const allOrders = await Order.findAll();
    
    // Get orders by status manually
    const ordersByStatus = allOrders.reduce((acc, order) => {
      acc[order.status] = (acc[order.status] || 0) + 1;
      return acc;
    }, {});

    // Get recent orders
    const recentOrders = allOrders
      .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
      .slice(0, 5);

    // Get total revenue (excluding cancelled orders)
    const totalRevenue = allOrders
      .filter(order => order.status !== 'cancelled')
      .reduce((sum, order) => sum + order.total, 0);

    // Get today's orders
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    const todayOrders = allOrders.filter(order => {
      const orderDate = new Date(order.created_at);
      return orderDate >= today && orderDate < tomorrow;
    }).length;

    res.json({
      stats: {
        totalOrders,
        totalMenuItems,
        totalCategories,
        totalUsers,
        todayOrders,
        totalRevenue
      },
      ordersByStatus,
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
    
    let allOrders = await Order.findAll();
    
    // Filter by status if provided
    if (status) {
      allOrders = allOrders.filter(order => order.status === status);
    }

    // Sort by created_at descending
    allOrders.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());

    // Pagination
    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + parseInt(limit);
    const orders = allOrders.slice(startIndex, endIndex);
    const total = allOrders.length;

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
    const order = await Order.updateStatus(req.params.id, status);

    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

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
    
    let allMenuItems = await MenuItem.findAll();
    
    // Filter by category if provided
    if (category && category !== 'all') {
      allMenuItems = allMenuItems.filter(item => item.category === category);
    }
    
    // Filter by availability if provided
    if (available !== undefined) {
      const isAvailable = available === 'true';
      allMenuItems = allMenuItems.filter(item => item.is_available === isAvailable);
    }

    // Sort by name
    allMenuItems.sort((a, b) => a.name.localeCompare(b.name));

    // Pagination
    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + parseInt(limit);
    const menuItems = allMenuItems.slice(startIndex, endIndex);
    const total = allMenuItems.length;

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

    const allUsers = await User.findAll();
    
    // Filter out admin users
    const nonAdminUsers = allUsers.filter(user => !user.is_admin);
    
    // Sort by created_at descending
    nonAdminUsers.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());

    // Pagination
    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + parseInt(limit);
    const users = nonAdminUsers.slice(startIndex, endIndex);
    const total = nonAdminUsers.length;

    // Remove password from user objects
    const usersWithoutPassword = users.map(({ password, ...user }) => user);

    res.json({
      users: usersWithoutPassword,
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
