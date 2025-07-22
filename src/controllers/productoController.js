// controllers/productoController.js
const { Producto } = require('../models');

exports.crearProducto = async (req, res) => {
  try {
    // Mapear los campos que vienen del frontend a los esperados por Sequelize
    const nuevoProducto = await Producto.create({
      nombre: req.body.Nombre_Producto,
      descripcion: req.body.Descripcion || '',
      precio_venta: req.body.Precio_Venta,
      precio_compra: req.body.Precio_Compra,
      cantidad: req.body.Cantidad,
      lote: req.body.Lote,
      ubicacion: req.body.Ubicacion || '',
      fecha_compra: req.body.Fecha_Compra || new Date(), // si no viene fecha, usar hoy
      id_producto: req.body.Id_Producto || null,         // si manejas ID externo
    });

    res.status(201).json(nuevoProducto);
  } catch (error) {
    console.error('Error al crear producto:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
};