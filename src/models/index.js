const Notificacion = require('./notificacionModel');
const sequelize = require('../config/database');
const Cliente = require('./clienteModel');
const Producto = require('./productoModel');
const Venta = require('./ventaModel');
const Evento = require('./eventoModel');
const Usuario = require('./usuarioModel');

Cliente.hasMany(Venta);
Venta.belongsTo(Cliente);

module.exports = { sequelize, Cliente, Producto, Venta, Evento, Usuario, Notificacion };
