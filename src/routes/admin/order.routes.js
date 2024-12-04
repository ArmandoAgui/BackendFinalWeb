const express = require('express');
const router = express.Router();
const orderController = require('../../controllers/admin/order.controller');
const authMiddleware = require('../../middleware/auth.middleware');

// Obtener todas las órdenes
router.get('/', authMiddleware, orderController.getAllOrders);

// Ruta para actualizar el estado de la orden
router.patch('/:uuid/status', authMiddleware, orderController.updateOrderStatus);

// Obtener información de una orden específica
router.get('/:uuid', authMiddleware, orderController.getOrderById);

router.get('/last-orders', authMiddleware, orderController.getLastOrders);

module.exports = router;
