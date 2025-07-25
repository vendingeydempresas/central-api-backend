import { sequelize } from '../config/database.js';  // Usa import en lugar de require
import Notificacion from './notificacionModel.js';
import Cliente from './clienteModel.js';
import Producto from './productoModel.js';
import Venta from './ventaModel.js';
import Evento from './eventoModel.js';
import Usuario from './usuarioModel.js';
import Pago from './pagoModel.js'; // Incluir el modelo de Pago para la base de datos

// Relaciones entre modelos
Cliente.hasMany(Venta);
Venta.belongsTo(Cliente);

// Otras relaciones si las tienes
// Producto.hasMany(Venta);
// Venta.belongsTo(Producto);

export { sequelize, Cliente, Producto, Venta, Evento, Usuario, Notificacion, Pago }; // Usa export en lugar de module.exports
