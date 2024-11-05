const Stats = require('../models/Stats');
const logger = require('../utils/logger');

const statsTracker = async (req, res, next) => {
  try {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    // Get or create today's stats
    let dailyStats = await Stats.findOne({ date: today });
    
    if (!dailyStats) {
      dailyStats = new Stats({ date: today });
    }

    // Increment total page views
    dailyStats.pageViews.total += 1;

    // Track page-specific views
    const path = req.path;
    const currentViews = dailyStats.pageViews.byPage.get(path) || 0;
    dailyStats.pageViews.byPage.set(path, currentViews + 1);

    // Track unique visitors using IP
    const visitorIP = req.ip;
    if (!dailyStats.visitors.ips.includes(visitorIP)) {
      dailyStats.visitors.ips.push(visitorIP);
      dailyStats.visitors.unique += 1;
    }
    dailyStats.visitors.total += 1;

    await dailyStats.save();
    next();
  } catch (error) {
    logger.error('Stats tracking error:', error);
    next(); // Continue even if stats tracking fails
  }
};

module.exports = statsTracker; 