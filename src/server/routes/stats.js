const express = require('express');
const router = express.Router();
const { auth } = require('../middleware/auth');
const { checkRole } = require('../middleware/rbac');
const Stats = require('../models/Stats');
const asyncHandler = require('../middleware/asyncHandler');

// Get overall stats (admin only)
router.get('/', auth, checkRole(['admin']), asyncHandler(async (req, res) => {
  const { startDate, endDate } = req.query;
  const query = {};

  if (startDate && endDate) {
    query.date = {
      $gte: new Date(startDate),
      $lte: new Date(endDate)
    };
  }

  const stats = await Stats.find(query).sort({ date: -1 });

  // Calculate aggregated stats
  const aggregated = stats.reduce((acc, stat) => {
    acc.totalPageViews += stat.pageViews.total;
    acc.totalUniqueVisitors += stat.visitors.unique;
    acc.totalVisitors += stat.visitors.total;
    acc.totalLikes += stat.interactions.likes;
    acc.totalComments += stat.interactions.comments;
    acc.totalShares += stat.interactions.shares;
    acc.totalDonations += stat.donations.count;
    acc.totalDonationAmount += stat.donations.total;
    return acc;
  }, {
    totalPageViews: 0,
    totalUniqueVisitors: 0,
    totalVisitors: 0,
    totalLikes: 0,
    totalComments: 0,
    totalShares: 0,
    totalDonations: 0,
    totalDonationAmount: 0
  });

  res.json({
    status: 'success',
    data: {
      dailyStats: stats,
      aggregated
    }
  });
}));

// Get today's stats (admin only)
router.get('/today', auth, checkRole(['admin']), asyncHandler(async (req, res) => {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  let stats = await Stats.findOne({ date: today });

  if (!stats) {
    stats = new Stats({ date: today });
    await stats.save();
  }

  res.json({
    status: 'success',
    data: stats
  });
}));

// Get popular pages (admin only)
router.get('/popular-pages', auth, checkRole(['admin']), asyncHandler(async (req, res) => {
  const { days = 7 } = req.query;
  const startDate = new Date();
  startDate.setDate(startDate.getDate() - days);

  const stats = await Stats.find({
    date: { $gte: startDate }
  });

  // Aggregate page views across all days
  const pageViews = stats.reduce((acc, stat) => {
    for (const [page, views] of stat.pageViews.byPage) {
      acc[page] = (acc[page] || 0) + views;
    }
    return acc;
  }, {});

  // Sort pages by views
  const popularPages = Object.entries(pageViews)
    .sort(([, a], [, b]) => b - a)
    .slice(0, 10);

  res.json({
    status: 'success',
    data: popularPages
  });
}));

// Track interaction (likes, comments, shares)
router.post('/interaction', auth, asyncHandler(async (req, res) => {
  const { type, postId } = req.body;
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  let stats = await Stats.findOne({ date: today });
  if (!stats) {
    stats = new Stats({ date: today });
  }

  // Increment interaction count
  stats.interactions[type] += 1;
  await stats.save();

  res.json({
    status: 'success',
    message: 'Interaction tracked successfully'
  });
}));

// Track donation
router.post('/donation', auth, asyncHandler(async (req, res) => {
  const { amount } = req.body;
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  let stats = await Stats.findOne({ date: today });
  if (!stats) {
    stats = new Stats({ date: today });
  }

  stats.donations.count += 1;
  stats.donations.total += amount;
  await stats.save();

  res.json({
    status: 'success',
    message: 'Donation tracked successfully'
  });
}));

module.exports = router; 