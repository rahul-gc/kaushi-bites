const express = require('express');
const { body, validationResult } = require('express-validator');
const { Order, MenuItem } = require('../models/SupabaseModels');
const { protect } = require('../middleware/auth');

const router = express.Router();

// @route   GET /api/orders
// @desc    Get user's orders
router.get('/', protect, async (req, res) => {
  try {
    const orders = await Order.find({ customerEmail: req.user.email })
      .sort({ createdAt: -1 });
    res.json(orders);
  } catch (error) {
    console.error('Get orders error:', error);
    res.status(500).json({ message: 'Server error while fetching orders' });
  }
});

// @route   GET /api/orders/:id
// @desc    Get order by ID
router.get('/:id', protect, async (req, res) => {
  try {
    const order = await Order.findOne({ 
      id: req.params.id,
      customerEmail: req.user.email 
    });

    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    res.json(order);
  } catch (error) {
    console.error('Get order error:', error);
    res.status(500).json({ message: 'Server error while fetching order' });
  }
});

// @route   POST /api/orders
// @desc    Create a new order
router.post('/', protect, [
  body('items').isArray({ min: 1 }).withMessage('Order must contain at least one item'),
  body('items.*.menuItemId').notEmpty().withMessage('Menu item ID is required'),
  body('items.*.quantity').isInt({ min: 1 }).withMessage('Quantity must be at least 1'),
  body('address').trim().isLength({ min: 5 }).withMessage('Address must be at least 5 characters'),
  body('phone').trim().isLength({ min: 10 }).withMessage('Phone number is required'),
  body('paymentMethod').isIn(['cod', 'esewa', 'khalti']).withMessage('Invalid payment method'),
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

    const { items, address, phone, paymentMethod, notes } = req.body;

    // Validate each item and calculate total
    let total = 0;
    const orderItems = [];

    for (const item of items) {
      const menuItem = await MenuItem.findOne({ 
        id: item.menuItemId, 
        isAvailable: true 
      });

      if (!menuItem) {
        return res.status(400).json({ 
          message: `Menu item ${item.menuItemId} not found or not available` 
        });
      }

      const subtotal = menuItem.price * item.quantity;
      total += subtotal;

      orderItems.push({
        menuItemId: menuItem.id,
        name: menuItem.name,
        price: menuItem.price,
        quantity: item.quantity,
        subtotal
      });
    }

    // Create new order
    const order = new Order({
      customerName: req.user.name,
      customerEmail: req.user.email,
      items: orderItems,
      total,
      address,
      phone,
      paymentMethod,
      notes,
      userId: req.user.id
    });

    await order.save();

    // Clear cart after order is placed
    if (req.session.cart) {
      req.session.cart = [];
    }

    res.status(201).json({
      message: 'Order placed successfully',
      order
    });
  } catch (error) {
    console.error('Create order error:', error);
    res.status(500).json({ message: 'Server error while creating order' });
  }
});

// @route   PUT /api/orders/:id/cancel
// @desc    Cancel an order (only if pending)
router.put('/:id/cancel', protect, async (req, res) => {
  try {
    const order = await Order.findOne({ 
      id: req.params.id,
      customerEmail: req.user.email 
    });

    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    if (order.status !== 'pending') {
      return res.status(400).json({ 
        message: 'Order cannot be cancelled. Current status: ' + order.status 
      });
    }

    order.status = 'cancelled';
    await order.save();

    res.json({
      message: 'Order cancelled successfully',
      order
    });
  } catch (error) {
    console.error('Cancel order error:', error);
    res.status(500).json({ message: 'Server error while cancelling order' });
  }
});

module.exports = router;
