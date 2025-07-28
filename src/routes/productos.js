const express = require('express');
const router = express.Router();
const { 
  crearProducto, 
  obtenerProductos, 
  actualizarProductoPorLote,
  obtenerProductoPorLote // ✅ nueva función agregada
} = require('../controllers/productoController');

// Crear producto
router.post('/', crearProducto);

// Obtener todos los productos
router.get('/', obtenerProductos);

// ✅ Obtener producto por lote (query string: ?lote=...)
router.get('/lote', obtenerProductoPorLote);

// ✅ Actualizar producto por lote (param: /lote/:lote)
router.patch('/lote/:lote', actualizarProductoPorLote);

module.exports = router;

