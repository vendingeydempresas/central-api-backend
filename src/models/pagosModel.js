// models/pagoModel.js
module.exports = (sequelize, DataTypes) => {
  const Pago = sequelize.define('Pago', {
    external_reference: { type: DataTypes.STRING, allowNull: false },
    mp_init_point: { type: DataTypes.STRING },
    estado: { type: DataTypes.STRING, defaultValue: 'pendiente' },
    metodo: { type: DataTypes.STRING }, // mercado_pago, transbank, etc.
  });

  return Pago;
};

