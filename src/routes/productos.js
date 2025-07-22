// routes/productos.js
const express = require('express');
const router = express.Router();
const { crearProducto, obtenerProductos } = require('../controllers/productoController');

// Ruta para crear producto (POST)
router.post('/', crearProducto);

// Ruta para obtener todos los productos (GET)
router.get('/', obtenerProductos);

module.exports = router;
