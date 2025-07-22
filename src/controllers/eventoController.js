// controllers/eventoController.js
const { Evento } = require('../models');

exports.crearEvento = async (req, res) => {
  try {
    // Mapea solo los campos que esperas o usa todo el body para detalle
    const detalle = {
      ID_Poducto_IV: req.body.ID_Poducto_IV || req.body.external_ref || null,
      Nombre_Producto_IV: req.body.Nombre_Producto_IV || req.body.title || '',
      Cantidad_Link_Pago_IV: req.body.Cantidad_Link_Pago_IV || req.body.quantity || 0,
      Precio_Venta_IV: req.body.Precio_Venta_IV || req.body.price || 0,
      Descripcion_IV: req.body.Descripcion_IV || req.body.description || '',
      Cantidad_Cargada_IV: req.body.Cantidad_Cargada_IV || req.body.CantidadCargada || 0,
      Numero_Vending_IV: req.body.Numero_Vending_IV || req.body.NumeroVending || '',
      Numero_Motor_IV: req.body.Numero_Motor_IV || req.body.NumeroMotor || '',
      Link_Pago: req.body.Link_Pago || req.body.link || '',
      QR_Link_Pago: req.body.QR_Link_Pago || '',
      Lote_Cargado_IV: req.body.Lote_Cargado_IV || req.body.Lotecargado || '',
      Precio_Compra_IV: req.body.Precio_Compra_IV || req.body.Precio_Compra_IV || 0,
      timestamp: req.body.timestamp || new Date().toISOString(),
    };

    const nuevoEvento = await Evento.create({
      tipo_evento: 'evento_pago',  // o lo que quieras dinámico
      detalle,
      fecha: new Date()
    });

    res.status(201).json(nuevoEvento);
  } catch (error) {
    console.error('Error al crear evento:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
};

exports.obtenerEventos = async (req, res) => {
  try {
    const eventos = await Evento.findAll();
    res.json(eventos);
  } catch (error) {
    console.error('Error al obtener eventos:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
};
