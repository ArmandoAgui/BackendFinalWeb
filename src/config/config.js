const dotenv = require('dotenv');
dotenv.config();

module.exports = {
    jwtSecret: process.env.JWT_SECRET,
    rateLimitMaxRequests: process.env.RATE_LIMIT_MAX_REQUESTS || 100,
    rateLimitWindowMs: process.env.RATE_LIMIT_WINDOW_MS || 60000,
};
