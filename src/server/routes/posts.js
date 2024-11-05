const express = require('express');
const router = express.Router();
const { auth } = require('../middleware/auth');
const { checkRole } = require('../middleware/rbac');
const Post = require('../models/Post');
const asyncHandler = require('../middleware/asyncHandler');

// Get all posts (public)
router.get('/', asyncHandler(async (req, res) => {
  const { page = 1, limit = 10, category, status = 'published' } = req.query;
  
  const query = { status };
  if (category) query.category = category;

  const posts = await Post.find(query)
    .populate('author', 'name')
    .sort({ publishDate: -1 })
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

// Get single post (public)
router.get('/:slug', asyncHandler(async (req, res) => {
  const post = await Post.findOne({ 
    slug: req.params.slug,
    status: 'published'
  }).populate('author', 'name');

  if (!post) {
    return res.status(404).json({
      status: 'error',
      message: 'Post not found'
    });
  }

  // Increment views
  post.views += 1;
  await post.save();

  res.json({
    status: 'success',
    data: post
  });
}));

// Create post (admin/editor only)
router.post('/', auth, checkRole(['admin', 'editor']), asyncHandler(async (req, res) => {
  const { title, content, excerpt, category, tags, featuredImage, status } = req.body;

  const post = new Post({
    title,
    content,
    excerpt,
    category,
    tags,
    featuredImage,
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

// Update post (admin/editor only)
router.put('/:id', auth, checkRole(['admin', 'editor']), asyncHandler(async (req, res) => {
  const { title, content, excerpt, category, tags, featuredImage, status } = req.body;
  const post = await Post.findById(req.params.id);

  if (!post) {
    return res.status(404).json({
      status: 'error',
      message: 'Post not found'
    });
  }

  // Check if user is author or admin
  if (post.author.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
    return res.status(403).json({
      status: 'error',
      message: 'Not authorized to edit this post'
    });
  }

  Object.assign(post, {
    title,
    content,
    excerpt,
    category,
    tags,
    featuredImage,
    status
  });

  await post.save();

  res.json({
    status: 'success',
    message: 'Post updated successfully',
    data: post
  });
}));

// Delete post (admin only)
router.delete('/:id', auth, checkRole(['admin']), asyncHandler(async (req, res) => {
  const post = await Post.findById(req.params.id);

  if (!post) {
    return res.status(404).json({
      status: 'error',
      message: 'Post not found'
    });
  }

  await post.remove();

  res.json({
    status: 'success',
    message: 'Post deleted successfully'
  });
}));

module.exports = router; 