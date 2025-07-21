const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Venta = sequelize.define('Venta', {
    total: DataTypes.FLOAT,
    estado: DataTypes.STRING, // ej: 'pendiente', 'pagado', 'cancelado'
    fecha: { type: DataTypes.DATE, defaultValue: DataTypes.NOW }
});

module.exports = Venta;
