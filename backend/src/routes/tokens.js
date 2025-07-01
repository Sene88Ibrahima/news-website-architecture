const express = require('express');
const asyncHandler = require('../middleware/errorHandler').asyncHandler;
const { protect, requireAdmin } = require('../middleware/auth');
const tokensController = require('../controllers/tokensController');
const router = express.Router();

// GET /api/tokens - list tokens (ADMIN)
router.get('/', protect, requireAdmin, asyncHandler(tokensController.getTokens));

// POST /api/tokens - generate token (ADMIN)
router.post('/', protect, requireAdmin, asyncHandler(tokensController.createToken));

// DELETE /api/tokens/:id - delete token (ADMIN)
router.delete('/:id', protect, requireAdmin, asyncHandler(tokensController.deleteToken));

module.exports = router;