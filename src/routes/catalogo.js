const express = require('express');
const router = express.Router();
const { crearProductoCatalogo, obtenerCatalogo } = require('../controllers/catalogoController');
const { upload } = require('../config/cloudinary');

// Este maneja imagen principal (1), imágenes adicionales (hasta 4) y video (1)
const fields = [
  { name: "imagenPrincipal", maxCount: 1 },
  { name: "imagenesAdicionales", maxCount: 4 },
  { name: "video", maxCount: 1 },
];

// Usar upload.fields para permitir múltiples tipos
router.post('/', upload.fields(fields), crearProductoCatalogo);
router.get('/', obtenerCatalogo);

module.exports = router;
