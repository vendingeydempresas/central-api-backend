const express = require('express');
const router = express.Router();
const transbankController = require('../controllers/transbankController');  // Importar correctamente el controlador

// Ruta para manejar el retorno de Transbank
router.all('/retorno', transbankController.retornoTransaccion);  // Asegúrate de que esta función exista en el controlador

module.exports = router;

