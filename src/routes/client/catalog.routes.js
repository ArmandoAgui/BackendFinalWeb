const express = require('express');
const router = express.Router();
const catalogController = require('../../controllers/client/catalog.controller');
const authMiddleware = require('../../middleware/auth.middleware');

// Ruta para obtener la lista de productos
router.get('/', catalogController.getProducts);

// Ruta para obtener la información de un producto específico
router.get('/:uuid', catalogController.getProductById);

router.get('/all', catalogController.getAllProducts);

module.exports = router;
