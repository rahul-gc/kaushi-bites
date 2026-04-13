const express = require('express');
const { body, validationResult } = require('express-validator');
const router = express.Router();
const { Category } = require('../models/SupabaseModels');
const { protect, adminOnly } = require('../middleware/auth');

// @route   GET /api/categories
// @desc    Get all categories
router.get('/', async (req, res) => {
  try {
    const categories = await Category.findAll();
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
    const category = await Category.findBySlug(req.params.slug);
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
// @desc    Create a new category (admin only)
router.post('/', protect, adminOnly, [
  body('name').trim().notEmpty().withMessage('Category name is required'),
  body('slug').trim().notEmpty().withMessage('Category slug is required'),
  body('image').optional().isURL().withMessage('Image must be a valid URL')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ message: 'Validation errors', errors: errors.array() });
    }

    const { name, slug, image } = req.body;

    // Check if category already exists
    const existingCategory = await Category.findBySlug(slug);
    if (existingCategory) {
      return res.status(400).json({ message: 'Category with this slug already exists' });
    }

    const category = await Category.create({ name, slug, image });

    res.status(201).json(category);
  } catch (error) {
    console.error('Create category error:', error);
    res.status(500).json({ message: 'Server error while creating category' });
  }
});

// @route   PUT /api/categories/:slug
// @desc    Update a category (Admin only)
router.put('/:slug', protect, adminOnly, [
  body('name').optional().trim().isLength({ min: 2 }).withMessage('Name must be at least 2 characters'),
  body('image').optional().isURL().withMessage('Image must be a valid URL')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ message: 'Validation errors', errors: errors.array() });
    }

    const { name, image } = req.body;
    const category = await Category.updateBySlug(req.params.slug, { name, image });

    if (!category) {
      return res.status(404).json({ message: 'Category not found' });
    }

    res.json(category);
  } catch (error) {
    console.error('Update category error:', error);
    res.status(500).json({ message: 'Server error while updating category' });
  }
});

// @route   DELETE /api/categories/:slug
// @desc    Delete a category (Admin only)
router.delete('/:slug', protect, adminOnly, async (req, res) => {
  try {
    const success = await Category.deleteBySlug(req.params.slug);
    if (!success) {
      return res.status(404).json({ message: 'Category not found' });
    }
    res.json({ message: 'Category deleted successfully' });
  } catch (error) {
    console.error('Delete category error:', error);
    res.status(500).json({ message: 'Server error while deleting category' });
  }
});

module.exports = router;
