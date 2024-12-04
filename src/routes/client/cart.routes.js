const express = require('express');
const router = express.Router();
const cartController = require('../../controllers/client/cart.controller');
const authMiddleware = require('../../middleware/auth.middleware');

// Rutas del carrito
router.post('/add', authMiddleware, cartController.addToCart);
router.get('/:userUuid', authMiddleware, cartController.getCart);
router.delete('/remove/:productUuid', cartController.removeProductFromCart);
router.put('/process', authMiddleware, cartController.processOrder);

module.exports = router;
