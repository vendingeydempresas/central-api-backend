const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Cliente = sequelize.define('Cliente', {
    nombre: DataTypes.STRING,
    email: DataTypes.STRING,
    telefono: DataTypes.STRING,
    ciudad: DataTypes.STRING,
    fecha_registro: { type: DataTypes.DATE, defaultValue: DataTypes.NOW }
});

module.exports = Cliente;
