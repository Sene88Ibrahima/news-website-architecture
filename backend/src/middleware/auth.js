const jwt = require('jsonwebtoken');
const { PrismaClient } = require('@prisma/client');
const { AppError, asyncHandler } = require('./errorHandler');
const { logger } = require('../utils/logger');

const prisma = new PrismaClient();

/**
 * Middleware to protect routes - requires valid JWT token
 */
const protect = asyncHandler(async (req, res, next) => {
  let token;

  // Get token from header
  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    token = req.headers.authorization.split(' ')[1];
  }

  // Make sure token exists
  if (!token) {
    return next(new AppError('Not authorized to access this route', 401));
  }

  try {
    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Get user from database
    const user = await prisma.user.findUnique({
      where: { id: decoded.id },
      select: {
        id: true,
        username: true,
        email: true,
        role: true,
        createdAt: true,
        updatedAt: true
      }
    });

    if (!user) {
      return next(new AppError('No user found with this token', 401));
    }

    // Grant access to protected route
    req.user = user;
    next();
  } catch (error) {
    logger.error('Token verification failed:', error);
    return next(new AppError('Not authorized to access this route', 401));
  }
});

/**
 * Middleware to restrict access to specific roles
 * @param {...string} roles - Allowed roles
 */
const restrictTo = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return next(
        new AppError('You do not have permission to perform this action', 403)
      );
    }
    next();
  };
};

/**
 * Middleware to check if user is editor or admin
 */
const requireEditor = restrictTo('EDITOR', 'ADMIN');

/**
 * Middleware to check if user is admin
 */
const requireAdmin = restrictTo('ADMIN');

/**
 * Middleware to validate API tokens for external services
 */
const validateApiToken = asyncHandler(async (req, res, next) => {
  const token = req.headers['x-api-token'] || req.query.token;

  if (!token) {
    return next(new AppError('API token is required', 401));
  }

  // Check if token exists and is active
  const authToken = await prisma.authToken.findUnique({
    where: { token }
  });

  if (!authToken || !authToken.isActive) {
    return next(new AppError('Invalid or inactive API token', 401));
  }

  // Check if token is expired
  if (authToken.expiresAt && new Date() > authToken.expiresAt) {
    return next(new AppError('API token has expired', 401));
  }

  req.apiToken = authToken;
  next();
});

/**
 * Optional authentication middleware - doesn't fail if no token
 */
const optionalAuth = asyncHandler(async (req, res, next) => {
  let token;

  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    token = req.headers.authorization.split(' ')[1];
  }

  if (token) {
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      const user = await prisma.user.findUnique({
        where: { id: decoded.id },
        select: {
          id: true,
          username: true,
          email: true,
          role: true,
          createdAt: true,
          updatedAt: true
        }
      });

      if (user) {
        req.user = user;
      }
    } catch (error) {
      // Token is invalid, but we don't fail the request
      logger.warn('Invalid token in optional auth:', error.message);
    }
  }

  next();
});

module.exports = {
  protect,
  restrictTo,
  requireEditor,
  requireAdmin,
  validateApiToken,
  optionalAuth
};