const express = require('express');
const router = express.Router();
const { asyncHandler } = require('../middleware/errorHandler');
const { protect } = require('../middleware/auth');
const authController = require('../controllers/authController');

router.post('/login', asyncHandler(authController.login));
router.post('/logout', protect, asyncHandler(authController.logout));
router.get('/me', protect, asyncHandler(authController.getProfile));

module.exports = router;