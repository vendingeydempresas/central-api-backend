const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Catalogo = sequelize.define('Catalogo', {
  id_producto: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true
  },
  nombre: DataTypes.STRING,
  descripcion: DataTypes.TEXT,
  precio: DataTypes.FLOAT,
  categoria: DataTypes.STRING,
  subcategoria: DataTypes.STRING,
  imagen_principal_url: DataTypes.STRING,
  imagenes_adicionales_url: DataTypes.ARRAY(DataTypes.STRING),
  video_url: DataTypes.STRING,
});

module.exports = Catalogo;
