const express = require('express');
const router = express.Router();
const orderController = require('../../controllers/client/order.controller');
const authMiddleware = require('../../middleware/auth.middleware');

// Crear una nueva orden
router.post('/', authMiddleware, orderController.createOrder);

// Obtener todas las órdenes del cliente
router.get('/orders', authMiddleware, orderController.getClientOrders);

// Obtener la información de una orden específica
router.get('/:uuid', authMiddleware, orderController.getOrderById);

// Ruta para agregar un producto a la orden
router.post('/add', authMiddleware, orderController.addProductToOrder);

module.exports = router;
