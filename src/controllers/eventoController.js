// controllers/eventoController.js
// controllers/eventoController.js
const { Evento } = require('../models');

exports.crearEvento = async (req, res) => {
  try {
    const nuevoEvento = await Evento.create({
      tipo_evento: 'evento_pago',
      ID_Producto_IV: req.body.ID_Producto_IV,
      Nombre_Producto_IV: req.body.Nombre_Producto_IV,
      Cantidad_Link_Pago_IV: req.body.Cantidad_Link_Pago_IV,
      Precio_Venta_IV: req.body.Precio_Venta_IV,
      Descripcion_IV: req.body.Descripcion_IV,
      Cantidad_Cargada_IV: req.body.Cantidad_Cargada_IV,
      Numero_Vending_IV: req.body.Numero_Vending_IV,
      Numero_Motor_IV: req.body.Numero_Motor_IV,
      Link_Pago: req.body.Link_Pago,
      QR_Link_Pago: req.body.QR_Link_Pago,
      Lote_Cargado_IV: req.body.Lote_Cargado_IV,
      Precio_Compra_IV: req.body.Precio_Compra_IV,
      timestamp: req.body.timestamp || new Date().toISOString(),
      fecha: new Date()
    });

    res.status(201).json(nuevoEvento);
  } catch (error) {
    console.error('Error al crear evento:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
};

// 🚨 ESTA PARTE FALTABA
exports.obtenerEventos = async (req, res) => {
  try {
    const eventos = await Evento.findAll();
    res.json(eventos);
  } catch (error) {
    console.error('Error al obtener eventos:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
};
