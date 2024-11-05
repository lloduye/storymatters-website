const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const { validateRegistration, validateLogin } = require('../middleware/validation');
const asyncHandler = require('../middleware/asyncHandler');

// Register new user
router.post('/register', validateRegistration, asyncHandler(async (req, res) => {
  const { email, password, name } = req.body;

  // Check if user exists
  const existingUser = await User.findOne({ email });
  if (existingUser) {
    return res.status(400).json({
      status: 'error',
      message: 'Email already registered'
    });
  }

  // Create new user
  const user = new User({
    email,
    password, // Password will be hashed by the pre-save middleware
    name,
    role: 'user'
  });

  await user.save();

  res.status(201).json({
    status: 'success',
    message: 'Registration successful'
  });
}));

// Login
router.post('/login', validateLogin, asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  // Find user
  const user = await User.findOne({ email });
  if (!user) {
    return res.status(401).json({
      status: 'error',
      message: 'Invalid credentials'
    });
  }

  // Check password
  const isMatch = await user.comparePassword(password);
  if (!isMatch) {
    return res.status(401).json({
      status: 'error',
      message: 'Invalid credentials'
    });
  }

  // Generate JWT token
  const token = jwt.sign(
    { userId: user._id, role: user.role },
    process.env.JWT_SECRET,
    { expiresIn: '24h' }
  );

  // Update last login
  user.lastLogin = new Date();
  await user.save();

  res.json({
    status: 'success',
    token,
    user: {
      id: user._id,
      name: user.name,
      email: user.email,
      role: user.role
    }
  });
}));

// Logout
router.post('/logout', asyncHandler(async (req, res) => {
  // Clear token cookie if using cookies
  res.clearCookie('token');
  
  res.json({
    status: 'success',
    message: 'Logged out successfully'
  });
}));

// Get current user
router.get('/me', auth, asyncHandler(async (req, res) => {
  res.json({
    status: 'success',
    user: {
      id: req.user._id,
      name: req.user.name,
      email: req.user.email,
      role: req.user.role
    }
  });
}));

module.exports = router; 