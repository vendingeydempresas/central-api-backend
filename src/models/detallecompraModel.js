const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const detallecompra = sequelize.define('detallecompra', {
  ID_Producto_IV: {
    type: DataTypes.STRING,
    allowNull: false
  },
  Nombre_Producto_IV: {
    type: DataTypes.STRING,
    allowNull: false
  },
  Cantidad_Link_Pago_IV: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  Precio_Venta_IV: {
    type: DataTypes.FLOAT,
    allowNull: false
  },
  Descripcion_IV: {
    type: DataTypes.TEXT,
    allowNull: false
  },
  Cantidad_Cargada_IV: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  Numero_Vending_IV: {
    type: DataTypes.STRING,
    allowNull: false
  },
  Numero_Motor_IV: {
    type: DataTypes.STRING,
    allowNull: false
  },
  Link_Pago: {
    type: DataTypes.STRING,
    allowNull: false
  },
  QR_Link_Pago: {
    type: DataTypes.STRING,
    allowNull: false
  },
  timestamp: {
    type: DataTypes.DATE,
    allowNull: false
  },
  Lote_Cargado_IV: {
    type: DataTypes.STRING,
    allowNull: false
  },
  Precio_Compra_IV: {
    type: DataTypes.FLOAT,
    allowNull: false
  }
});

module.exports = detallecompra;
