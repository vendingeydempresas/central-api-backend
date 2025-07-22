const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Producto = sequelize.define('Producto', {
    nombre: DataTypes.STRING,
    descripcion: DataTypes.TEXT,
    precio: DataTypes.FLOAT,
    stock: DataTypes.INTEGER,
    creado_en: { type: DataTypes.DATE, defaultValue: DataTypes.NOW }
});

module.exports = (sequelize, DataTypes) => {
  const Producto = sequelize.define('Producto', {
    nombre: DataTypes.STRING,
    descripcion: DataTypes.TEXT,
    precio_venta: DataTypes.FLOAT,
    precio_compra: DataTypes.FLOAT,
    cantidad: DataTypes.INTEGER,
    lote: DataTypes.STRING,
    ubicacion: DataTypes.STRING,
    fecha_compra: DataTypes.DATE,
    id_producto: DataTypes.STRING // si lo usas
  });

  return Producto;
};

