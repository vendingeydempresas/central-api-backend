const express = require('express');
const router = express.Router();
const { crearProductoCatalogo, obtenerCatalogo } = require('../controllers/catalogoController');

router.post('/', crearProductoCatalogo);
router.get('/', obtenerCatalogo);

module.exports = router;
