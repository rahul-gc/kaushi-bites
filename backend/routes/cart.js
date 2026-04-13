const express = require('express');
const { body, validationResult } = require('express-validator');
const { MenuItem } = require('../models/SupabaseModels');
const { protect } = require('../middleware/auth');

const router = express.Router();

// @route   GET /api/cart
// @desc    Get user's cart (stored in session for now)
router.get('/', protect, async (req, res) => {
  try {
    // For simplicity, we'll store cart in session
    // In a real app, you might want to persist cart to database
    const cart = req.session.cart || [];
    res.json({ items: cart });
  } catch (error) {
    console.error('Get cart error:', error);
    res.status(500).json({ message: 'Server error while fetching cart' });
  }
});

// @route   POST /api/cart/add
// @desc    Add item to cart
router.post('/add', protect, [
  body('menuItemId').notEmpty().withMessage('Menu item ID is required'),
  body('quantity').isInt({ min: 1 }).withMessage('Quantity must be at least 1'),
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

    const { menuItemId, quantity = 1 } = req.body;

    // Check if menu item exists and is available
    const menuItem = await MenuItem.findById(menuItemId);
    if (!menuItem || !menuItem.is_available) {
      return res.status(404).json({ message: 'Menu item not found or not available' });
    }

    // Initialize cart if it doesn't exist
    if (!req.session.cart) {
      req.session.cart = [];
    }

    // Check if item already exists in cart
    const existingItemIndex = req.session.cart.findIndex(item => item.id === menuItemId);
    
    if (existingItemIndex > -1) {
      // Update quantity if item exists
      req.session.cart[existingItemIndex].quantity += quantity;
    } else {
      // Add new item to cart
      req.session.cart.push({
        id: menuItem.id,
        name: menuItem.name,
        price: menuItem.price,
        description: menuItem.description,
        category: menuItem.category,
        image: menuItem.image,
        rating: menuItem.rating,
        badge: menuItem.badge,
        isAvailable: menuItem.is_available,
        isFeatured: menuItem.is_featured,
        quantity
      });
    }

    res.json({
      message: 'Item added to cart successfully',
      cart: req.session.cart
    });
  } catch (error) {
    console.error('Add to cart error:', error);
    res.status(500).json({ message: 'Server error while adding item to cart' });
  }
});

// @route   PUT /api/cart/update/:menuItemId
// @desc    Update cart item quantity
router.put('/update/:menuItemId', protect, [
  body('quantity').isInt({ min: 0 }).withMessage('Quantity must be 0 or more'),
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

    const { menuItemId } = req.params;
    const { quantity } = req.body;

    if (!req.session.cart) {
      return res.status(400).json({ message: 'Cart is empty' });
    }

    const itemIndex = req.session.cart.findIndex(item => item.id === menuItemId);
    
    if (itemIndex === -1) {
      return res.status(404).json({ message: 'Item not found in cart' });
    }

    if (quantity === 0) {
      // Remove item from cart
      req.session.cart.splice(itemIndex, 1);
    } else {
      // Update quantity
      req.session.cart[itemIndex].quantity = quantity;
    }

    res.json({
      message: 'Cart updated successfully',
      cart: req.session.cart
    });
  } catch (error) {
    console.error('Update cart error:', error);
    res.status(500).json({ message: 'Server error while updating cart' });
  }
});

// @route   DELETE /api/cart/remove/:menuItemId
// @desc    Remove item from cart
router.delete('/remove/:menuItemId', protect, async (req, res) => {
  try {
    const { menuItemId } = req.params;

    if (!req.session.cart) {
      return res.status(400).json({ message: 'Cart is empty' });
    }

    const itemIndex = req.session.cart.findIndex(item => item.id === menuItemId);
    
    if (itemIndex === -1) {
      return res.status(404).json({ message: 'Item not found in cart' });
    }

    // Remove item from cart
    req.session.cart.splice(itemIndex, 1);

    res.json({
      message: 'Item removed from cart successfully',
      cart: req.session.cart
    });
  } catch (error) {
    console.error('Remove from cart error:', error);
    res.status(500).json({ message: 'Server error while removing item from cart' });
  }
});

// @route   DELETE /api/cart/clear
// @desc    Clear entire cart
router.delete('/clear', protect, async (req, res) => {
  try {
    req.session.cart = [];

    res.json({
      message: 'Cart cleared successfully',
      cart: []
    });
  } catch (error) {
    console.error('Clear cart error:', error);
    res.status(500).json({ message: 'Server error while clearing cart' });
  }
});

// @route   GET /api/cart/summary
// @desc    Get cart summary (total, count)
router.get('/summary', protect, async (req, res) => {
  try {
    const cart = req.session.cart || [];
    
    const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    const count = cart.reduce((sum, item) => sum + item.quantity, 0);

    res.json({
      total,
      count,
      itemCount: cart.length
    });
  } catch (error) {
    console.error('Cart summary error:', error);
    res.status(500).json({ message: 'Server error while getting cart summary' });
  }
});

module.exports = router;
