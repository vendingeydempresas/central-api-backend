// controllers/productoController.js
const { Producto } = require('../models');

// Crear producto
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

// Obtener todos los productos
exports.obtenerProductos = async (req, res) => {
  try {
    const productos = await Producto.findAll();
    res.json(productos);
  } catch (error) {
    console.error('Error al obtener productos:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
};

// ✅ Actualizar producto por LOTE
exports.actualizarProductoPorLote = async (req, res) => {
  const { lote } = req.params;
  const { cantidad } = req.body;

  try {
    const producto = await Producto.findOne({ where: { lote } });

    if (!producto) {
      return res.status(404).json({ error: 'Producto con ese lote no encontrado' });
    }

    producto.cantidad = cantidad;
    await producto.save();

    res.json({ message: 'Cantidad actualizada correctamente', producto });
  } catch (error) {
    console.error('Error actualizando producto por lote:', error);
    res.status(500).json({ error: 'Error actualizando producto' });
  }
};
