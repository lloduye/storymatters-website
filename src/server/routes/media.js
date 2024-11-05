const express = require('express');
const router = express.Router();
const multer = require('multer');
const { auth } = require('../middleware/auth');
const { checkRole } = require('../middleware/rbac');
const Media = require('../models/Media');
const asyncHandler = require('../middleware/asyncHandler');
const { uploadToStorage, deleteFromStorage } = require('../utils/storage');

// Configure multer for file upload
const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB limit
  },
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith('image/') || 
        file.mimetype.startsWith('video/') ||
        file.mimetype === 'application/pdf') {
      cb(null, true);
    } else {
      cb(new Error('Invalid file type'));
    }
  }
});

// Get all media (admin/editor only)
router.get('/', auth, checkRole(['admin', 'editor']), asyncHandler(async (req, res) => {
  const { page = 1, limit = 20, type } = req.query;
  
  const query = {};
  if (type) query.type = type;

  const media = await Media.find(query)
    .populate('uploadedBy', 'name')
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

// Upload media (admin/editor only)
router.post('/', auth, checkRole(['admin', 'editor']), upload.single('file'), asyncHandler(async (req, res) => {
  if (!req.file) {
    return res.status(400).json({
      status: 'error',
      message: 'No file uploaded'
    });
  }

  // Upload to cloud storage
  const url = await uploadToStorage(req.file);

  const media = new Media({
    filename: req.file.originalname,
    originalName: req.file.originalname,
    mimeType: req.file.mimetype,
    size: req.file.size,
    url,
    uploadedBy: req.user._id,
    type: req.file.mimetype.startsWith('image/') ? 'image' : 
          req.file.mimetype.startsWith('video/') ? 'video' : 'document'
  });

  await media.save();

  res.status(201).json({
    status: 'success',
    message: 'File uploaded successfully',
    data: media
  });
}));

// Delete media (admin only)
router.delete('/:id', auth, checkRole(['admin']), asyncHandler(async (req, res) => {
  const media = await Media.findById(req.params.id);

  if (!media) {
    return res.status(404).json({
      status: 'error',
      message: 'Media not found'
    });
  }

  // Delete from cloud storage
  await deleteFromStorage(media.url);
  await media.remove();

  res.json({
    status: 'success',
    message: 'Media deleted successfully'
  });
}));

module.exports = router; 