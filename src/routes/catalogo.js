const express = require('express');
const router = express.Router();
const { crearProductoCatalogo, obtenerCatalogo } = require('../controllers/catalogoController');
const { upload } = require('../config/cloudinary');
const Catalogo = require('../models/catalogoModel');


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

// 🔽 NUEVA RUTA: Obtener producto por ID
router.get('/:id_producto', async (req, res) => {
  try {
    const producto = await Catalogo.findOne({
      where: { id_producto: req.params.id_producto }
    });

    if (!producto) {
      return res.status(404).json({ error: "Producto no encontrado" });
    }

    res.json(producto);
  } catch (error) {
    console.error("Error al obtener producto por ID:", error);
    res.status(500).json({ error: "Error interno del servidor" });
  }
});

module.exports = router;
