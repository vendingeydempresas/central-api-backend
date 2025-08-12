const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Usuario = sequelize.define('Usuario', {
  nombre: { type: DataTypes.STRING, allowNull: false },
  email: { type: DataTypes.STRING, allowNull: false, unique: true },
  password: { type: DataTypes.STRING, allowNull: false },
  fechaNacimiento: { type: DataTypes.DATEONLY },
  sexo: { type: DataTypes.ENUM('M', 'F', 'Otro') }
});

module.exports = Usuario;
