const express = require('express');
const router = express.Router();
const adminAuthController = require('../../controllers/admin/adminAuth.controller');
const authMiddleware = require('../../middleware/auth.middleware');

// Registro de administrador
router.post('/register', adminAuthController.registre);

// Inicio de sesión de administrador
router.post('/login', adminAuthController.login);

// Cierre de sesión
router.post('/logout', adminAuthController.logout);

module.exports = router;
