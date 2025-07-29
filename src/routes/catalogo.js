const express = require('express');
const router = express.Router();
const { crearProductoCatalogo, obtenerCatalogo } = require('../controllers/catalogoController');
const { upload } = require('../config/cloudinary');

// Usamos multer con los campos definidos para archivos multimedia
router.post(
  '/',
  upload.fields([
    { name: 'imagenPrincipal', maxCount: 1 },
    { name: 'imagenesAdicionales', maxCount: 4 },
    { name: 'video', maxCount: 1 }
  ]),
  crearProductoCatalogo
);

router.get('/', obtenerCatalogo);

module.exports = router;
