const express = require('express');
const router = express.Router();
const upload = require('../../config/multer');
const productController = require('../../controllers/admin/product.controller');
const authMiddleware = require('../../middleware/auth.middleware');

// Obtener lista de productos
router.get('/', authMiddleware, productController.getAllProducts);

// Obtener información de un producto específico
router.get('/:uuid', authMiddleware, productController.getProductById);

// Ruta para agregar producto con opciones personalizables
router.post('/', authMiddleware, upload.single('image'), productController.createProductWithCustomOptions);

// Ruta para actualizar un producto (solo administrador)
router.put('/:uuid', authMiddleware, upload.single('image'), productController.updateProduct);

// Ruta para eliminar un producto por UUID
router.delete('/:uuid', productController.deleteProduct);

module.exports = router;
