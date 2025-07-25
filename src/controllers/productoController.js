// controllers/productoController.js
const { Producto } = require('../models');

exports.crearProducto = async (req, res) => {
  try {
    const nuevoProducto = await Producto.create({
      nombre: req.body.Nombre_Producto,
      descripcion: req.body.Descripcion || '',
      precio_venta: req.body.Precio_Venta,
      precio_compra: req.body.Precio_Compra,
      cantidad: req.body.Cantidad,
      lote: req.body.Lote,
      ubicacion: req.body.Ubicacion || '',
      fecha_compra: req.body.Fecha_Compra || new Date(),
      id_producto: req.body.Id_Producto || null,
    });
    res.status(201).json(nuevoProducto);
  } catch (error) {
    console.error('Error al crear producto:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
};

exports.obtenerProductos = async (req, res) => {
  try {
    const productos = await Producto.findAll();
    res.json(productos);
  } catch (error) {
    console.error('Error al obtener productos:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
};
