const DetalleCompra = require('../models/detallecompraModel');

exports.guardardetallecompra = async (req, res) => {
  try {
    const {
      ID_Producto_IV,
      Nombre_Producto_IV,
      Cantidad_Link_Pago_IV,
      Precio_Venta_IV,
      Descripcion_IV,
      Cantidad_Cargada_IV,
      Numero_Vending_IV,
      Numero_Motor_IV,
      Link_Pago,
      QR_Link_Pago,
      timestamp,
      Lote_Cargado_IV,
      Precio_Compra_IV,
    } = req.body;


exports.obtenerDetalles = async (req, res) => {
  try {
    const detalles = await DetalleCompra.findAll({ order: [['createdAt', 'DESC']] });
    res.status(200).json(detalles);
  } catch (error) {
    console.error('Error al obtener los detalles de compra:', error);
    res.status(500).json({ error: 'Error al obtener los detalles de compra' });
  }
};




    // Validación básica
    if (!ID_Producto_IV || !Nombre_Producto_IV || !Cantidad_Link_Pago_IV) {
      return res.status(400).json({ error: 'Faltan datos obligatorios' });
    }

    // Intentamos crear el producto en la base de datos
    const producto = await DetalleCompra.create({
      ID_Producto_IV,
      Nombre_Producto_IV,
      Cantidad_Link_Pago_IV,
      Precio_Venta_IV,
      Descripcion_IV,
      Cantidad_Cargada_IV,
      Numero_Vending_IV,
      Numero_Motor_IV,
      Link_Pago,
      QR_Link_Pago,
      timestamp,
      Lote_Cargado_IV,
      Precio_Compra_IV,
    });

    res.status(201).json({ message: 'Producto guardado exitosamente', producto });
  } catch (error) {
    console.error('Error al guardar el producto:', error);
    res.status(500).json({ error: 'Error al guardar el producto', details: error.message });
  }
};
