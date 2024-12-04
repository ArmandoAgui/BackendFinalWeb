const express = require('express');
const router = express.Router();
const adminUserController = require('../../controllers/admin/adminUser.controller');
const authMiddleware = require('../../middleware/auth.middleware');

// Rutas para gestionar usuarios administradores
router.get('/', authMiddleware, adminUserController.getAllAdminUsers);
router.post('/', authMiddleware, adminUserController.createAdminUser);
router.get('/:uuid', authMiddleware, adminUserController.getAdminUserByUuid);
router.put('/:uuid', authMiddleware, adminUserController.updateAdminUser);
router.delete('/:uuid', authMiddleware, adminUserController.deleteAdminUser);

module.exports = router;
