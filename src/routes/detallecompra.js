const express = require('express');
const router = express.Router();
const { guardardetallecompra, obtenerDetalles } = require('../controllers/detallecompraController');

// Ruta POST para guardar un detalle de compra
router.post('/', guardardetallecompra);

// Ruta GET para obtener todos los detalles guardados
router.get('/', obtenerDetalles);

module.exports = router;
