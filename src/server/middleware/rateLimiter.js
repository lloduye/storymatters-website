const rateLimit = require('express-rate-limit');
const RedisStore = require('rate-limit-redis');
const redis = require('../config/redis');
const logger = require('../utils/logger');

// General API rate limiter
const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limit each IP to 100 requests per windowMs
  message: {
    status: 'error',
    message: 'Too many requests from this IP, please try again after 15 minutes'
  },
  handler: (req, res) => {
    logger.warn(`Rate limit exceeded for IP: ${req.ip}`);
    res.status(429).json({
      status: 'error',
      message: 'Too many requests from this IP, please try again after 15 minutes'
    });
  }
});

// Auth endpoints rate limiter (more strict)
const authLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 5, // Limit each IP to 5 login attempts per hour
  message: {
    status: 'error',
    message: 'Too many login attempts, please try again after an hour'
  },
  handler: (req, res) => {
    logger.warn(`Auth rate limit exceeded for IP: ${req.ip}`);
    res.status(429).json({
      status: 'error',
      message: 'Too many login attempts, please try again after an hour'
    });
  }
});

// Media upload rate limiter
const uploadLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 10, // Limit each IP to 10 uploads per hour
  message: {
    status: 'error',
    message: 'Upload limit reached, please try again after an hour'
  },
  handler: (req, res) => {
    logger.warn(`Upload rate limit exceeded for IP: ${req.ip}`);
    res.status(429).json({
      status: 'error',
      message: 'Upload limit reached, please try again after an hour'
    });
  }
});

// Newsletter subscription rate limiter
const newsletterLimiter = rateLimit({
  windowMs: 24 * 60 * 60 * 1000, // 24 hours
  max: 3, // Limit each IP to 3 subscription attempts per day
  message: {
    status: 'error',
    message: 'Too many subscription attempts, please try again tomorrow'
  },
  handler: (req, res) => {
    logger.warn(`Newsletter rate limit exceeded for IP: ${req.ip}`);
    res.status(429).json({
      status: 'error',
      message: 'Too many subscription attempts, please try again tomorrow'
    });
  }
});

// Store rate limit data in Redis if available
if (redis) {
  const redisStore = new RedisStore({
    client: redis,
    prefix: 'rl:',
    resetExpiryOnChange: true
  });

  apiLimiter.store = redisStore;
  authLimiter.store = redisStore;
  uploadLimiter.store = redisStore;
  newsletterLimiter.store = redisStore;
}

module.exports = {
  apiLimiter,
  authLimiter,
  uploadLimiter,
  newsletterLimiter
}; 