const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Producto = sequelize.define('Producto', {
    nombre: DataTypes.STRING,
    descripcion: DataTypes.TEXT,
    precio: DataTypes.FLOAT,
    stock: DataTypes.INTEGER,
    creado_en: { type: DataTypes.DATE, defaultValue: DataTypes.NOW }
});

module.exports = Producto;
