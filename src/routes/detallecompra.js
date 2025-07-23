const express = require('express');
const router = express.Router();
const detallecompraController = require('../controllers/detallecompraController');

// Ruta POST para guardar un detalle de compra
router.post('/', detallecompraController.guardardetallecompra);

module.exports = router;
