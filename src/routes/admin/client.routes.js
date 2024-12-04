const express = require('express');
const router = express.Router();
const { getAllClients, getClientByUuid, updateClientStatus } = require('../../controllers/admin/client.controller');
const authMiddleware = require('../../middleware/auth.middleware'); // Importación directa

// Ruta para ver todos los clientes
router.get('/', authMiddleware, getAllClients);

// Ruta para ver detalles de un cliente específico
router.get('/:uuid', authMiddleware, getClientByUuid);

// Ruta para cambiar el estado de un cliente
router.patch('/:uuid/status', authMiddleware, updateClientStatus);

module.exports = router;