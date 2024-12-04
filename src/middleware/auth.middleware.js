const jwt = require('jsonwebtoken');
const config = require('../config/config');

// Lista negra de tokens (temporal en memoria, idealmente en la base de datos)
let tokenBlacklist = [];

// Middleware para verificar tokens y lista negra
module.exports = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    // Log para verificar si el token está presente
    console.log('Auth Header:', authHeader);
    console.log('Token recibido:', token);

    if (!token) {
        return res.status(401).json({ message: 'Token requerido' });
    }

    // Verificar si el token está en la lista negra
    if (tokenBlacklist.includes(token)) {
        return res.status(403).json({ message: 'Token inválido. Por favor, inicia sesión nuevamente.' });
    }

    try {
        // Verificar el token JWT
        const decoded = jwt.verify(token, config.jwtSecret);
        req.user = decoded; // Adjuntar la información del usuario al request
        next(); // Continuar con la siguiente función
    } catch (err) {
        console.error('Error al verificar el token:', err);
        res.status(403).json({ message: 'Token inválido' });
    }
};

// Función para agregar un token a la lista negra
module.exports.addToBlacklist = (token) => {
    tokenBlacklist.push(token);
};

// Función para verificar si un token está en la lista negra
module.exports.isBlacklisted = (token) => {
    return tokenBlacklist.includes(token);
};
