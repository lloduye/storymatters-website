const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const mongoSanitize = require('express-mongo-sanitize');
const { 
  apiLimiter, 
  authLimiter, 
  uploadLimiter, 
  newsletterLimiter 
} = require('./middleware/rateLimiter');
const errorHandler = require('./middleware/errorHandler');
const postsRoutes = require('./routes/posts');
const mediaRoutes = require('./routes/media');
const statsRoutes = require('./routes/stats');
const config = require('./config/config');
const statsTracker = require('./middleware/statsTracker');

const app = express();

// Security Middleware
app.use(helmet());
app.use(cors());
app.use(express.json({ limit: '10kb' }));
app.use(mongoSanitize());

// Routes
app.use('/api/posts', postsRoutes);
app.use('/api/media', mediaRoutes);
app.use('/api/stats', statsRoutes);

// Stats tracking middleware
app.use(statsTracker);

// Error handling
app.use(errorHandler);

// Apply rate limiting to all API routes
app.use('/api/', apiLimiter);

// Apply stricter limits to auth routes
app.use('/api/auth/login', authLimiter);
app.use('/api/auth/register', authLimiter);

// Limit media uploads
app.use('/api/media/upload', uploadLimiter);

// Limit newsletter subscriptions
app.use('/api/newsletter/subscribe', newsletterLimiter);

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

module.exports = app; 