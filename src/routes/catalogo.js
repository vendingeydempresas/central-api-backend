const express = require('express');
const router = express.Router();
const { crearCatalogo, obtenerCatalogos } = require('../controllers/catalogoController');

router.post('/', crearCatalogo);
router.get('/', obtenerCatalogos);

module.exports = router;
