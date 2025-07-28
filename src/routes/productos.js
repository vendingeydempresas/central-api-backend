// routes/productos.js
const express = require('express');
const router = express.Router();
const { 
  crearProducto, 
  obtenerProductos, 
  actualizarProductoPorLote // <--- Asegúrate de importar esta función
} = require('../controllers/productoController');

// Crear producto
router.post('/', crearProducto);

// Obtener todos los productos
router.get('/', obtenerProductos);

// ✅ Nueva ruta para actualizar por LOTE
router.patch('/lote/:lote', actualizarProductoPorLote);

module.exports = router;
