// routes/eventos.js
const express = require('express');
const router = express.Router();
const eventoController = require('../controllers/eventoController');

router.get('/', eventoController.obtenerEventos);
router.post('/', eventoController.crearEvento);

module.exports = router;

