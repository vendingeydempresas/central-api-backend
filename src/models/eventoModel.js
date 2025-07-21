const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Evento = sequelize.define('Evento', {
    tipo_evento: DataTypes.STRING,
    detalle: DataTypes.JSON,
    fecha: { type: DataTypes.DATE, defaultValue: DataTypes.NOW }
});

module.exports = Evento;
