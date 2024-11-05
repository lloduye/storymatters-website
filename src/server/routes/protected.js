const express = require('express');
const router = express.Router();
const { auth, authorize, checkPermission, checkOwnership } = require('../middleware/auth');
const Post = require('../models/Post');

// Protected route requiring authentication
router.get('/profile', auth, async (req, res) => {
  res.json(req.user);
});

// Route requiring specific role
router.get('/admin-dashboard', 
  auth, 
  authorize(['admin']), 
  async (req, res) => {
    // Admin dashboard logic
});

// Route requiring specific permission
router.post('/posts',
  auth,
  checkPermission('create_post'),
  async (req, res) => {
    // Create post logic
});

// Route requiring resource ownership
router.put('/posts/:id',
  auth,
  checkOwnership(Post),
  async (req, res) => {
    // Update post logic
});

module.exports = router; 