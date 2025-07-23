// models/eventoModel.js
module.exports = (sequelize, DataTypes) => {
  const Evento = sequelize.define('Evento', {
    tipo_evento: DataTypes.STRING,
    ID_Producto_IV: DataTypes.STRING,
    Nombre_Producto_IV: DataTypes.STRING,
    Cantidad_Link_Pago_IV: DataTypes.INTEGER,
    Precio_Venta_IV: DataTypes.FLOAT,
    Descripcion_IV: DataTypes.STRING,
    Cantidad_Cargada_IV: DataTypes.INTEGER,
    Numero_Vending_IV: DataTypes.STRING,
    Numero_Motor_IV: DataTypes.STRING,
    Link_Pago: DataTypes.STRING,
    QR_Link_Pago: DataTypes.STRING,
    Lote_Cargado_IV: DataTypes.STRING,
    Precio_Compra_IV: DataTypes.FLOAT,
    timestamp: DataTypes.DATE,
    fecha: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    },
  });

  return Evento;
};
