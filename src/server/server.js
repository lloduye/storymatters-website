const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const mongoSanitize = require('express-mongo-sanitize');
const { authLimiter } = require('./middleware/rateLimiter');
const errorHandler = require('./middleware/errorHandler');
const postsRoutes = require('./routes/posts');
const mediaRoutes = require('./routes/media');
const config = require('./config/config');

const app = express();

// Security Middleware
app.use(helmet());
app.use(cors());
app.use(express.json({ limit: '10kb' }));
app.use(mongoSanitize());

// Routes
app.use('/api/posts', postsRoutes);
app.use('/api/media', mediaRoutes);

// Error handling
app.use(errorHandler);

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

module.exports = app; 