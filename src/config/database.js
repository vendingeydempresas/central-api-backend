require('dotenv').config(); // Muy importante, debe ser la primera línea
console.log('USUARIO BASE DE DATOS:', process.env.DB_USER);
const { Sequelize } = require('sequelize');

const sequelize = new Sequelize(
  process.env.DB_NAME,
  process.env.DB_USER,
  process.env.DB_PASSWORD,
  {
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    dialect: 'postgres',
    logging: false
  }
);

console.log('USUARIO BASE DE DATOS:', process.env.DB_USER); // 👈 Agrega esta línea temporalmente

module.exports = sequelize;
