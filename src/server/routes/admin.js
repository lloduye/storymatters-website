const express = require('express');
const router = express.Router();
const { auth } = require('../middleware/auth');
const { checkRole } = require('../middleware/rbac');
const asyncHandler = require('../middleware/asyncHandler');
const User = require('../models/User');

// Admin Dashboard - Admin Only
router.get('/dashboard', auth, checkRole(['admin']), asyncHandler(async (req, res) => {
  const stats = {
    totalUsers: await User.countDocuments(),
    newUsers: await User.countDocuments({ 
      createdAt: { $gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000) }
    }),
    // Add other relevant stats
  };
  
  res.json({
    status: 'success',
    data: stats
  });
}));

// User Management - Admin Only
router.get('/users', auth, checkRole(['admin']), asyncHandler(async (req, res) => {
  const users = await User.find()
    .select('-password')
    .sort({ createdAt: -1 });
  
  res.json({
    status: 'success',
    data: users
  });
}));

// Update User Role - Admin Only
router.patch('/users/:userId/role', auth, checkRole(['admin']), asyncHandler(async (req, res) => {
  const { role } = req.body;
  const user = await User.findById(req.params.userId);

  if (!user) {
    return res.status(404).json({
      status: 'error',
      message: 'User not found'
    });
  }

  // Update role and permissions
  user.role = role;
  user.permissions = User.getRolePermissions(role);
  await user.save();

  res.json({
    status: 'success',
    message: 'User role updated successfully'
  });
}));

// Delete User - Admin Only
router.delete('/users/:userId', auth, checkRole(['admin']), asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.userId);

  if (!user) {
    return res.status(404).json({
      status: 'error',
      message: 'User not found'
    });
  }

  await user.remove();

  res.json({
    status: 'success',
    message: 'User deleted successfully'
  });
}));

module.exports = router; 