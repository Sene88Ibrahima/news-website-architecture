const express = require('express');
const asyncHandler = require('../middleware/errorHandler').asyncHandler;
const { protect, requireEditor } = require('../middleware/auth');
const articlesController = require('../controllers/articlesController');
const router = express.Router();

// GET /api/articles - paginated list
router.get('/', asyncHandler(articlesController.getArticles));

// GET /api/articles/:id - article detail
router.get('/:id', asyncHandler(articlesController.getArticleById));

// POST /api/articles - create (EDITOR+)
router.post('/', protect, requireEditor, asyncHandler(articlesController.createArticle));

// PUT /api/articles/:id - update (EDITOR+)
router.put('/:id', protect, requireEditor, asyncHandler(articlesController.updateArticle));

// DELETE /api/articles/:id - delete (EDITOR+)
router.delete('/:id', protect, requireEditor, asyncHandler(articlesController.deleteArticle));

module.exports = router;