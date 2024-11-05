const express = require('express');
const router = express.Router();
const admin = require('firebase-admin');
const User = require('../models/User');
const asyncHandler = require('../middleware/asyncHandler');

// Google login/signup
router.post('/google', asyncHandler(async (req, res) => {
  const { token, email, name, photoURL } = req.body;

  try {
    // Verify Firebase token
    const decodedToken = await admin.auth().verifyIdToken(token);
    
    // Find or create user
    let user = await User.findOne({ email });

    if (!user) {
      // Create new user if doesn't exist
      user = new User({
        email,
        name,
        profileImage: photoURL,
        socialId: decodedToken.uid,
        socialProvider: 'google',
        isVerified: true
      });
      await user.save();
    }

    // Generate JWT token
    const jwtToken = jwt.sign(
      { userId: user._id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: '24h' }
    );

    res.json({
      status: 'success',
      token: jwtToken,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        profileImage: user.profileImage
      }
    });
  } catch (error) {
    res.status(401).json({
      status: 'error',
      message: 'Invalid token'
    });
  }
}));

// Facebook login/signup
router.post('/facebook', asyncHandler(async (req, res) => {
  const { token, email, name, photoURL } = req.body;

  try {
    // Verify Firebase token
    const decodedToken = await admin.auth().verifyIdToken(token);
    
    // Find or create user
    let user = await User.findOne({ email });

    if (!user) {
      // Create new user if doesn't exist
      user = new User({
        email,
        name,
        profileImage: photoURL,
        socialId: decodedToken.uid,
        socialProvider: 'facebook',
        isVerified: true
      });
      await user.save();
    }

    // Generate JWT token
    const jwtToken = jwt.sign(
      { userId: user._id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: '24h' }
    );

    res.json({
      status: 'success',
      token: jwtToken,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        profileImage: user.profileImage
      }
    });
  } catch (error) {
    res.status(401).json({
      status: 'error',
      message: 'Invalid token'
    });
  }
}));

module.exports = router; 