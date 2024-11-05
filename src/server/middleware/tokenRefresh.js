const jwt = require('jsonwebtoken');
const User = require('../models/User');
const logger = require('../utils/logger');

const tokenRefresh = async (req, res, next) => {
  try {
    const refreshToken = req.header('Refresh-Token');
    
    if (!refreshToken) {
      return next();
    }

    // Verify refresh token
    const decoded = jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET);
    
    // Find user
    const user = await User.findById(decoded.userId).select('-password');
    
    if (!user) {
      throw new Error('User not found');
    }

    // Generate new access token
    const accessToken = jwt.sign(
      { userId: user._id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: '15m' }
    );

    // Add new token to response headers
    res.setHeader('New-Access-Token', accessToken);
    
    next();
  } catch (error) {
    logger.error('Token refresh error:', error);
    next();
  }
};

module.exports = tokenRefresh; 