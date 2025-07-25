const express = require('express');
const router = express.Router();
const transbankController = require('../controllers/transbankController');

router.get('/pago', transbankController.iniciarPago);
router.all('/retorno', transbankController.retornoPago);

module.exports = router;
