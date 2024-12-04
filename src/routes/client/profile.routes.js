const express = require('express');
const router = express.Router();
const { getProfile, updateProfile, changePassword } = require('../../controllers/client/user.controller');
const authMiddleware = require('../../middleware/auth.middleware');

// Obtener información del perfil
router.get('/', authMiddleware, getProfile);

// Actualizar información del perfil
router.put('/', authMiddleware, updateProfile);

module.exports = router;
