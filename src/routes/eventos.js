// routes/eventos.js
const express = require('express');
const router = express.Router();

// Aquí tus controladores y rutas, por ejemplo:
router.get('/', (req, res) => {
  res.send('Lista de eventos');
});

module.exports = router;
