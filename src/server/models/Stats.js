const mongoose = require('mongoose');

const statsSchema = new mongoose.Schema({
  date: {
    type: Date,
    required: true,
    unique: true
  },
  visitors: {
    total: { type: Number, default: 0 },
    unique: { type: Number, default: 0 }
  },
  pageViews: {
    total: { type: Number, default: 0 },
    byPage: {
      type: Map,
      of: Number,
      default: new Map()
    }
  },
  interactions: {
    likes: { type: Number, default: 0 },
    comments: { type: Number, default: 0 },
    shares: { type: Number, default: 0 }
  },
  donations: {
    count: { type: Number, default: 0 },
    total: { type: Number, default: 0 }
  },
  userMetrics: {
    newUsers: { type: Number, default: 0 },
    activeUsers: { type: Number, default: 0 }
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
statsSchema.pre('save', function(next) {
  this.updatedAt = new Date();
  next();
});

// Create indexes
statsSchema.index({ date: -1 });

module.exports = mongoose.model('Stats', statsSchema); 