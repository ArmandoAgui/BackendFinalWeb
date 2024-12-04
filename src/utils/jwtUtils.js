const jwt = require('jsonwebtoken');
const config = require('../config/config');

exports.generateToken = (user) => {
    if (!config.jwtSecret) {
        throw new Error('JWT_SECRET no está definido en el archivo .env');
    }
    return jwt.sign(
        { uuid: user.uuid, role: user.role },
        config.jwtSecret,
        { expiresIn: '1h' }
    );
};
