// routes/transbank.js
const express = require('express');
const router = express.Router();
const transbankController = require('../controllers/transbankController');

// GET para iniciar pago (recibe ?data=...)
router.get('/pago', transbankController.iniciarPago);

// Retorno Webpay (POST normalmente, aceptamos all por seguridad)
router.all('/retorno', transbankController.retornoPago);

module.exports = router;
