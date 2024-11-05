const jwt = require('jsonwebtoken');
const User = require('../models/User');
const logger = require('../utils/logger');

const auth = async (req, res, next) => {
  try {
    // Get token from header
    const token = req.header('Authorization')?.replace('Bearer ', '');
    
    if (!token) {
      throw new Error('No authentication token provided');
    }

    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    // Find user
    const user = await User.findById(decoded.userId)
      .select('-password')
      .lean();

    if (!user) {
      throw new Error('User not found');
    }

    // Check if token is blacklisted (for logout)
    const isBlacklisted = await checkTokenBlacklist(token);
    if (isBlacklisted) {
      throw new Error('Token has been invalidated');
    }

    // Add user and token to request
    req.user = user;
    req.token = token;
    
    next();
  } catch (error) {
    logger.error('Authentication error:', error);
    
    res.status(401).json({
      status: 'error',
      message: error.message || 'Authentication failed'
    });
  }
};

// Role-based authorization middleware
const authorize = (roles = []) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({
        status: 'error',
        message: 'Authentication required'
      });
    }

    if (roles.length && !roles.includes(req.user.role)) {
      return res.status(403).json({
        status: 'error',
        message: 'Unauthorized access'
      });
    }

    next();
  };
};

// Permission-based authorization middleware
const checkPermission = (permission) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({
        status: 'error',
        message: 'Authentication required'
      });
    }

    if (!req.user.permissions.includes(permission)) {
      return res.status(403).json({
        status: 'error',
        message: 'Insufficient permissions'
      });
    }

    next();
  };
};

// Resource ownership middleware
const checkOwnership = (model) => {
  return async (req, res, next) => {
    try {
      const resource = await model.findById(req.params.id);
      
      if (!resource) {
        return res.status(404).json({
          status: 'error',
          message: 'Resource not found'
        });
      }

      if (resource.author?.toString() !== req.user._id.toString() && 
          req.user.role !== 'admin') {
        return res.status(403).json({
          status: 'error',
          message: 'Unauthorized access to this resource'
        });
      }

      req.resource = resource;
      next();
    } catch (error) {
      next(error);
    }
  };
};

module.exports = {
  auth,
  authorize,
  checkPermission,
  checkOwnership
}; 