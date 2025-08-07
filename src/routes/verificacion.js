const express = require('express');
const router = express.Router();
const verificacionController = require('../controllers/verificacionController');

router.get('/verificar-transaccion/:referencia', verificacionController.verificarTransaccion);

module.exports = router;
