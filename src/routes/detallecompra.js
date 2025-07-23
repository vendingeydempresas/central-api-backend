const express = require('express');
const router = express.Router();
const detallecompraController = require('../controllers/detallecompraController');

// Ruta para guardar un producto nuevo
router.post('/', detallecompraController.guardardetallecompra);

module.exports = router;
