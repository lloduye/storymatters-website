const mongoose = require('mongoose');

const mediaSchema = new mongoose.Schema({
  filename: {
    type: String,
    required: true
  },
  originalName: {
    type: String,
    required: true
  },
  mimeType: {
    type: String,
    required: true
  },
  size: {
    type: Number,
    required: true
  },
  url: {
    type: String,
    required: true
  },
  uploadedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  type: {
    type: String,
    enum: ['image', 'video', 'document'],
    required: true
  },
  usage: [{
    model: {
      type: String,
      enum: ['post', 'user', 'program']
    },
    documentId: {
      type: mongoose.Schema.Types.ObjectId
    }
  }],
  metadata: {
    width: Number,
    height: Number,
    duration: Number,
    thumbnail: String
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

// Update timestamp on save
mediaSchema.pre('save', function(next) {
  this.updatedAt = new Date();
  next();
});

// Create indexes
mediaSchema.index({ uploadedBy: 1 });
mediaSchema.index({ type: 1 });
mediaSchema.index({ 'usage.model': 1, 'usage.documentId': 1 });

module.exports = mongoose.model('Media', mediaSchema); 