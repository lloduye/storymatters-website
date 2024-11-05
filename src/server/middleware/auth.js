const jwt = require('jsonwebtoken');
const User = require('../models/User');

const auth = async (req, res, next) => {
  try {
    const token = req.header('Authorization')?.replace('Bearer ', '');
    
    if (!token) {
      throw new Error('No authentication token provided');
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.userId);

    if (!user) {
      throw new Error('User not found');
    }

    // Add user and permissions to request
    req.user = user;
    req.userPermissions = User.getRolePermissions(user.role);
    next();
  } catch (error) {
    res.status(401).json({
      status: 'error',
      message: 'Authentication failed'
    });
  }
};

module.exports = { auth }; 