const express = require('express');
const asyncHandler = require('../middleware/errorHandler').asyncHandler;
const { protect, requireAdmin } = require('../middleware/auth');
const usersController = require('../controllers/usersController');
const router = express.Router();

// GET /api/users - list (ADMIN)
router.get('/', protect, requireAdmin, asyncHandler(usersController.getUsers));

// POST /api/users - create (ADMIN)
router.post('/', protect, requireAdmin, asyncHandler(usersController.createUser));

// PUT /api/users/:id - update (ADMIN)
router.put('/:id', protect, requireAdmin, asyncHandler(usersController.updateUser));

// DELETE /api/users/:id - delete (ADMIN)
router.delete('/:id', protect, requireAdmin, asyncHandler(usersController.deleteUser));

module.exports = router;