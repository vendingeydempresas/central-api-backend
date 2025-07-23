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

    // Validación básica
    if (!ID_Producto_IV || !Nombre_Producto_IV) {
      return res.status(400).json({ error: 'Faltan datos obligatorios' });
    }

    console.log('Datos recibidos:', req.body);  // Verifica si los datos llegan correctamente

    // Crear el producto
    const producto = await detallecompra.create({
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
    res.status(500).json({ error: 'Error interno del servidor' });
  }
};
