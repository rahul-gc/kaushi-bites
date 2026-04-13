const express = require('express');
const { body, validationResult } = require('express-validator');
const Category = require('../models/Category');
const { protect, adminOnly } = require('../middleware/auth');

const router = express.Router();

// @route   GET /api/categories
// @desc    Get all categories
router.get('/', async (req, res) => {
  try {
    const categories = await Category.find().sort({ name: 1 });
    res.json(categories);
  } catch (error) {
    console.error('Get categories error:', error);
    res.status(500).json({ message: 'Server error while fetching categories' });
  }
});

// @route   GET /api/categories/:slug
// @desc    Get category by slug
router.get('/:slug', async (req, res) => {
  try {
    const category = await Category.findOne({ slug: req.params.slug });
    if (!category) {
      return res.status(404).json({ message: 'Category not found' });
    }
    res.json(category);
  } catch (error) {
    console.error('Get category error:', error);
    res.status(500).json({ message: 'Server error while fetching category' });
  }
});

// @route   POST /api/categories
// @desc    Create a new category (Admin only)
router.post('/', protect, adminOnly, [
  body('name').trim().isLength({ min: 2 }).withMessage('Name must be at least 2 characters'),
  body('slug').trim().isLength({ min: 2 }).withMessage('Slug must be at least 2 characters'),
  body('image').isURL().withMessage('Image must be a valid URL'),
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

    const { name, slug, image } = req.body;

    // Check if category already exists
    const existingCategory = await Category.findOne({ slug });
    if (existingCategory) {
      return res.status(400).json({ message: 'Category already exists with this slug' });
    }

    // Create new category
    const category = new Category({
      id: slug,
      name,
      slug,
      image
    });

    await category.save();

    res.status(201).json({
      message: 'Category created successfully',
      category
    });
  } catch (error) {
    console.error('Create category error:', error);
    res.status(500).json({ message: 'Server error while creating category' });
  }
});

// @route   PUT /api/categories/:slug
// @desc    Update a category (Admin only)
router.put('/:slug', protect, adminOnly, [
  body('name').optional().trim().isLength({ min: 2 }).withMessage('Name must be at least 2 characters'),
  body('image').optional().isURL().withMessage('Image must be a valid URL'),
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

    const { name, image } = req.body;
    const category = await Category.findOne({ slug: req.params.slug });

    if (!category) {
      return res.status(404).json({ message: 'Category not found' });
    }

    // Update fields
    if (name) category.name = name;
    if (image) category.image = image;

    await category.save();

    res.json({
      message: 'Category updated successfully',
      category
    });
  } catch (error) {
    console.error('Update category error:', error);
    res.status(500).json({ message: 'Server error while updating category' });
  }
});

// @route   DELETE /api/categories/:slug
// @desc    Delete a category (Admin only)
router.delete('/:slug', protect, adminOnly, async (req, res) => {
  try {
    const category = await Category.findOne({ slug: req.params.slug });

    if (!category) {
      return res.status(404).json({ message: 'Category not found' });
    }

    // Check if category has menu items
    const MenuItem = require('../models/MenuItem');
    const menuItemsCount = await MenuItem.countDocuments({ category: category.slug });
    if (menuItemsCount > 0) {
      return res.status(400).json({ 
        message: 'Cannot delete category. It has menu items associated with it.' 
      });
    }

    await Category.deleteOne({ slug: req.params.slug });

    res.json({
      message: 'Category deleted successfully'
    });
  } catch (error) {
    console.error('Delete category error:', error);
    res.status(500).json({ message: 'Server error while deleting category' });
  }
});

module.exports = router;
