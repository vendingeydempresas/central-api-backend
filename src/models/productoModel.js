const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Producto = sequelize.define('Producto', {
  nombre: DataTypes.STRING,
  descripcion: DataTypes.TEXT,
  precio_venta: DataTypes.FLOAT,
  precio_compra: DataTypes.FLOAT,
  cantidad: DataTypes.INTEGER,
  lote: DataTypes.STRING,
  ubicacion: DataTypes.STRING,
  fecha_compra: DataTypes.DATE,
  id_producto: DataTypes.STRING
});

module.exports = Producto;

