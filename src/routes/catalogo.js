const express = require('express');
const router = express.Router();
const { crearProductoCatalogo, obtenerCatalogo } = require('../controllers/catalogoController');

// Importa el middleware de multer
const upload = require('../middleware/multer');

// Ruta para crear producto con imágenes y video
router.post(
  '/',
  upload.fields([
    { name: 'imagenPrincipal', maxCount: 1 },
    { name: 'imagenesAdicionales', maxCount: 4 },
    { name: 'video', maxCount: 1 }
  ]),
  crearProductoCatalogo
);

// Ruta para obtener el catálogo
router.get('/', obtenerCatalogo);

module.exports = router;
