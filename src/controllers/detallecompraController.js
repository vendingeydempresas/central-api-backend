const detallecompra = require('../models/detallecompraModel');

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

    // Validación básica (puedes agregar más si lo deseas)
    if (!ID_Producto_IV || !Nombre_Producto_IV) {
      return res.status(400).json({ error: 'Faltan datos obligatorios' });
    }

    // Crear el producto
    const producto = new detallecompra({
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

    // Guardar en la base de datos
    await producto.save();
    res.status(201).json({ message: 'Producto guardado exitosamente', producto });

  } catch (error) {
    console.error('Error al guardar el producto:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
};
