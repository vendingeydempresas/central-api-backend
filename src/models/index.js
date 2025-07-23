// models/index.js
const fs = require('fs');
const path = require('path');
const Sequelize = require('sequelize');
const basename = path.basename(__filename);
const config = require(__dirname + '/../config/database.js');
const db = {};

const sequelize = new Sequelize(config);

fs
  .readdirSync(__dirname)
  .filter(
    file =>
      file.indexOf('.') !== 0 &&
      file !== basename &&
      file.slice(-3) === '.js'
  )
  .forEach(file => {
    const model = require(path.join(__dirname, file))(sequelize, Sequelize.DataTypes);
    db[model.name] = model;
  });

// Relaciones de ejemplo
if (db.Cliente && db.Venta) {
  db.Cliente.hasMany(db.Venta);
  db.Venta.belongsTo(db.Cliente);
}

db.sequelize = sequelize;
db.Sequelize = Sequelize;

module.exports = db;
