const express = require('express');
const router = express.Router();
const clientAuthController = require('../../controllers/client/clientAuth.controller');

router.post('/register', clientAuthController.register);
router.post('/login', clientAuthController.login);

module.exports = router;
