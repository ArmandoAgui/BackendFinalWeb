const express = require('express');
const router = express.Router();
const statsController = require('../../controllers/admin/stats.controller');
const authMiddleware = require('../../middleware/auth.middleware');

// Rutas para análisis de datos
router.get('/popular-products', authMiddleware, statsController.getMostPopularProducts);
router.get('/orders-count-last-year', authMiddleware, statsController.getOrdersCountByMonthLastYear);
router.get('/earnings-last-year', authMiddleware, statsController.getEarningsByMonthLastYear);

module.exports = router;
