const express = require('express');
const router = express.Router();
const { auth } = require('../middleware/auth');
const { checkRole } = require('../middleware/rbac');
const User = require('../models/User');
const Post = require('../models/Post');
const Media = require('../models/Media');
const asyncHandler = require('../middleware/asyncHandler');

// Get user profile
router.get('/profile', auth, asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id).select('-password');
  
  res.json({
    status: 'success',
    data: user
  });
}));

// Update user profile
router.put('/profile', auth, asyncHandler(async (req, res) => {
  const { name, email, bio } = req.body;
  
  // Check if email is being changed and is already taken
  if (email !== req.user.email) {
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({
        status: 'error',
        message: 'Email already in use'
      });
    }
  }

  const user = await User.findByIdAndUpdate(
    req.user._id,
    { 
      name,
      email,
      bio,
      updatedAt: new Date()
    },
    { new: true, runValidators: true }
  ).select('-password');

  res.json({
    status: 'success',
    message: 'Profile updated successfully',
    data: user
  });
}));

// Change password
router.put('/change-password', auth, asyncHandler(async (req, res) => {
  const { currentPassword, newPassword } = req.body;
  
  const user = await User.findById(req.user._id);
  const isMatch = await user.comparePassword(currentPassword);
  
  if (!isMatch) {
    return res.status(400).json({
      status: 'error',
      message: 'Current password is incorrect'
    });
  }

  user.password = newPassword;
  await user.save();

  res.json({
    status: 'success',
    message: 'Password updated successfully'
  });
}));

// Get user's posts
router.get('/posts', auth, asyncHandler(async (req, res) => {
  const { page = 1, limit = 10, status } = req.query;
  
  const query = { author: req.user._id };
  if (status) query.status = status;

  const posts = await Post.find(query)
    .sort({ createdAt: -1 })
    .limit(limit * 1)
    .skip((page - 1) * limit);

  const count = await Post.countDocuments(query);

  res.json({
    status: 'success',
    data: {
      posts,
      totalPages: Math.ceil(count / limit),
      currentPage: page
    }
  });
}));

// Create new post
router.post('/posts', auth, asyncHandler(async (req, res) => {
  const { title, content, category, tags, status = 'draft' } = req.body;

  const post = new Post({
    title,
    content,
    category,
    tags,
    status,
    author: req.user._id
  });

  await post.save();

  res.status(201).json({
    status: 'success',
    message: 'Post created successfully',
    data: post
  });
}));

// Get user's media
router.get('/media', auth, asyncHandler(async (req, res) => {
  const { page = 1, limit = 20, type } = req.query;
  
  const query = { uploadedBy: req.user._id };
  if (type) query.type = type;

  const media = await Media.find(query)
    .sort({ createdAt: -1 })
    .limit(limit * 1)
    .skip((page - 1) * limit);

  const count = await Media.countDocuments(query);

  res.json({
    status: 'success',
    data: {
      media,
      totalPages: Math.ceil(count / limit),
      currentPage: page
    }
  });
}));

// Get user's activity stats
router.get('/stats', auth, asyncHandler(async (req, res) => {
  const [posts, media, drafts] = await Promise.all([
    Post.countDocuments({ author: req.user._id, status: 'published' }),
    Media.countDocuments({ uploadedBy: req.user._id }),
    Post.countDocuments({ author: req.user._id, status: 'draft' })
  ]);

  const recentActivity = await Post.find({ author: req.user._id })
    .sort({ updatedAt: -1 })
    .limit(5)
    .select('title status updatedAt');

  res.json({
    status: 'success',
    data: {
      stats: {
        totalPosts: posts,
        totalMedia: media,
        drafts
      },
      recentActivity
    }
  });
}));

// Delete user's post
router.delete('/posts/:id', auth, asyncHandler(async (req, res) => {
  const post = await Post.findOne({
    _id: req.params.id,
    author: req.user._id
  });

  if (!post) {
    return res.status(404).json({
      status: 'error',
      message: 'Post not found or unauthorized'
    });
  }

  await post.remove();

  res.json({
    status: 'success',
    message: 'Post deleted successfully'
  });
}));

// Update user's post
router.put('/posts/:id', auth, asyncHandler(async (req, res) => {
  const { title, content, category, tags, status } = req.body;

  const post = await Post.findOne({
    _id: req.params.id,
    author: req.user._id
  });

  if (!post) {
    return res.status(404).json({
      status: 'error',
      message: 'Post not found or unauthorized'
    });
  }

  Object.assign(post, {
    title,
    content,
    category,
    tags,
    status,
    updatedAt: new Date()
  });

  await post.save();

  res.json({
    status: 'success',
    message: 'Post updated successfully',
    data: post
  });
}));

module.exports = router; 