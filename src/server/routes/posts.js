const express = require('express');
const router = express.Router();
const { auth, authorize, checkPermission, checkOwnership } = require('../middleware/auth');
const Post = require('../models/Post');

// Get all posts (public)
router.get('/', async (req, res) => {
  // ... implementation
});

// Create post (authenticated users only)
router.post('/',
  auth,
  checkPermission('create_post'),
  async (req, res) => {
    // ... implementation
  }
);

// Update post (owner or admin only)
router.put('/:id',
  auth,
  checkOwnership(Post),
  async (req, res) => {
    // ... implementation
  }
);

// Delete post (admin only)
router.delete('/:id',
  auth,
  authorize(['admin']),
  async (req, res) => {
    // ... implementation
  }
);

module.exports = router; 