const rateLimit = require('express-rate-limit');
const config = require('../config/config');

module.exports = rateLimit({
    windowMs: config.rateLimitWindowMs,
    max: config.rateLimitMaxRequests,
    message: 'Demasiadas peticiones, intente más tarde.',
});
