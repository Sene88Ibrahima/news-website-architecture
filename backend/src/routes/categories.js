const express = require('express');
const asyncHandler = require('../middleware/errorHandler').asyncHandler;
const { protect, requireEditor } = require('../middleware/auth');
const categoriesController = require('../controllers/categoriesController');
const router = express.Router();

// GET /api/categories - list all
router.get('/', asyncHandler(categoriesController.getCategories));

// POST /api/categories - create (EDITOR+)
router.post('/', protect, requireEditor, asyncHandler(categoriesController.createCategory));

// PUT /api/categories/:id - update (EDITOR+)
router.put('/:id', protect, requireEditor, asyncHandler(categoriesController.updateCategory));

// DELETE /api/categories/:id - delete (EDITOR+)
router.delete('/:id', protect, requireEditor, asyncHandler(categoriesController.deleteCategory));

module.exports = router;