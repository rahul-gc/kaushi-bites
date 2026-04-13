const express = require('express');
const { body, validationResult } = require('express-validator');
const MenuItem = require('../models/MenuItem');
const { protect, adminOnly } = require('../middleware/auth');

const router = express.Router();

// @route   GET /api/menu
// @desc    Get all menu items with optional filtering
router.get('/', async (req, res) => {
  try {
    const { category, featured, available } = req.query;
    let filter = {};

    if (category && category !== 'all') {
      filter.category = category;
    }
    if (featured === 'true') {
      filter.isFeatured = true;
    }
    if (available === 'true') {
      filter.isAvailable = true;
    }

    const menuItems = await MenuItem.find(filter).sort({ name: 1 });
    res.json(menuItems);
  } catch (error) {
    console.error('Get menu items error:', error);
    res.status(500).json({ message: 'Server error while fetching menu items' });
  }
});

// @route   GET /api/menu/featured
// @desc    Get featured menu items
router.get('/featured', async (req, res) => {
  try {
    const featuredItems = await MenuItem.find({ 
      isFeatured: true, 
      isAvailable: true 
    }).sort({ name: 1 });
    res.json(featuredItems);
  } catch (error) {
    console.error('Get featured items error:', error);
    res.status(500).json({ message: 'Server error while fetching featured items' });
  }
});

// @route   GET /api/menu/category/:category
// @desc    Get menu items by category
router.get('/category/:category', async (req, res) => {
  try {
    const { category } = req.params;
    const menuItems = await MenuItem.find({ 
      category, 
      isAvailable: true 
    }).sort({ name: 1 });
    res.json(menuItems);
  } catch (error) {
    console.error('Get menu items by category error:', error);
    res.status(500).json({ message: 'Server error while fetching menu items' });
  }
});

// @route   GET /api/menu/:id
// @desc    Get menu item by ID
router.get('/:id', async (req, res) => {
  try {
    const menuItem = await MenuItem.findOne({ id: req.params.id });
    if (!menuItem) {
      return res.status(404).json({ message: 'Menu item not found' });
    }
    res.json(menuItem);
  } catch (error) {
    console.error('Get menu item error:', error);
    res.status(500).json({ message: 'Server error while fetching menu item' });
  }
});

// @route   POST /api/menu
// @desc    Create a new menu item (Admin only)
router.post('/', protect, adminOnly, [
  body('name').trim().isLength({ min: 2 }).withMessage('Name must be at least 2 characters'),
  body('description').trim().isLength({ min: 10 }).withMessage('Description must be at least 10 characters'),
  body('price').isFloat({ min: 0 }).withMessage('Price must be a positive number'),
  body('category').trim().notEmpty().withMessage('Category is required'),
  body('image').isURL().withMessage('Image must be a valid URL'),
  body('rating').optional().isFloat({ min: 0, max: 5 }).withMessage('Rating must be between 0 and 5'),
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

    const { name, description, price, category, image, rating, badge, isAvailable, isFeatured } = req.body;

    // Check if category exists
    const Category = require('../models/Category');
    const categoryExists = await Category.findOne({ slug: category });
    if (!categoryExists) {
      return res.status(400).json({ message: 'Category does not exist' });
    }

    // Create new menu item
    const menuItem = new MenuItem({
      name,
      description,
      price,
      category,
      image,
      rating: rating || 0,
      badge,
      isAvailable: isAvailable !== undefined ? isAvailable : true,
      isFeatured: isFeatured !== undefined ? isFeatured : false
    });

    await menuItem.save();

    res.status(201).json({
      message: 'Menu item created successfully',
      menuItem
    });
  } catch (error) {
    console.error('Create menu item error:', error);
    res.status(500).json({ message: 'Server error while creating menu item' });
  }
});

// @route   PUT /api/menu/:id
// @desc    Update a menu item (Admin only)
router.put('/:id', protect, adminOnly, [
  body('name').optional().trim().isLength({ min: 2 }).withMessage('Name must be at least 2 characters'),
  body('description').optional().trim().isLength({ min: 10 }).withMessage('Description must be at least 10 characters'),
  body('price').optional().isFloat({ min: 0 }).withMessage('Price must be a positive number'),
  body('category').optional().trim().notEmpty().withMessage('Category cannot be empty'),
  body('image').optional().isURL().withMessage('Image must be a valid URL'),
  body('rating').optional().isFloat({ min: 0, max: 5 }).withMessage('Rating must be between 0 and 5'),
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

    const { name, description, price, category, image, rating, badge, isAvailable, isFeatured } = req.body;
    const menuItem = await MenuItem.findOne({ id: req.params.id });

    if (!menuItem) {
      return res.status(404).json({ message: 'Menu item not found' });
    }

    // If category is being updated, check if it exists
    if (category && category !== menuItem.category) {
      const Category = require('../models/Category');
      const categoryExists = await Category.findOne({ slug: category });
      if (!categoryExists) {
        return res.status(400).json({ message: 'Category does not exist' });
      }
      menuItem.category = category;
    }

    // Update fields
    if (name) menuItem.name = name;
    if (description) menuItem.description = description;
    if (price !== undefined) menuItem.price = price;
    if (image) menuItem.image = image;
    if (rating !== undefined) menuItem.rating = rating;
    if (badge !== undefined) menuItem.badge = badge;
    if (isAvailable !== undefined) menuItem.isAvailable = isAvailable;
    if (isFeatured !== undefined) menuItem.isFeatured = isFeatured;

    await menuItem.save();

    res.json({
      message: 'Menu item updated successfully',
      menuItem
    });
  } catch (error) {
    console.error('Update menu item error:', error);
    res.status(500).json({ message: 'Server error while updating menu item' });
  }
});

// @route   DELETE /api/menu/:id
// @desc    Delete a menu item (Admin only)
router.delete('/:id', protect, adminOnly, async (req, res) => {
  try {
    const menuItem = await MenuItem.findOne({ id: req.params.id });

    if (!menuItem) {
      return res.status(404).json({ message: 'Menu item not found' });
    }

    await MenuItem.deleteOne({ id: req.params.id });

    res.json({
      message: 'Menu item deleted successfully'
    });
  } catch (error) {
    console.error('Delete menu item error:', error);
    res.status(500).json({ message: 'Server error while deleting menu item' });
  }
});

module.exports = router;
