const express = require('express');
const asyncHandler = require('../middleware/errorHandler').asyncHandler;
const { protect, requireAdmin } = require('../middleware/auth');
const tokensController = require('../controllers/tokensController');
const router = express.Router();

// GET /api/tokens - list tokens (ADMIN)
router.get('/', protect, requireAdmin, asyncHandler(tokensController.getTokens));

// POST /api/tokens - generate token (ADMIN)
router.post('/', protect, requireAdmin, asyncHandler(tokensController.createToken));

// PUT /api/tokens/:id/toggle - toggle token status (ADMIN)
router.put('/:id/toggle', protect, requireAdmin, asyncHandler(tokensController.toggleToken));

// DELETE /api/tokens/:id - delete token (ADMIN)
router.delete('/:id', protect, requireAdmin, asyncHandler(tokensController.deleteToken));

module.exports = router;