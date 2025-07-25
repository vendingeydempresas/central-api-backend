const express = require('express');
const router = express.Router();
const { createPayment, handleReturn } = require('../controllers/transbankController');

// Ruta para crear la transacción de pago
router.post('/pago', createPayment);

// Ruta para manejar el retorno de la transacción
router.all('/retorno', handleReturn);

module.exports = router;
