const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Notificacion = sequelize.define('Notificacion', {
  payment_id: DataTypes.STRING,
  status: DataTypes.STRING,
  monto: DataTypes.DECIMAL,
  referencia: DataTypes.STRING,
  payment_method: DataTypes.STRING,
  currency: DataTypes.STRING,
  payer_id: DataTypes.STRING,
  payer_email: DataTypes.STRING,
  description: DataTypes.TEXT,
  status_detail: DataTypes.STRING,
  transaction_amount: DataTypes.DECIMAL,
  installments: DataTypes.INTEGER,
  payment_type: DataTypes.STRING,
  order_id: DataTypes.STRING,
  order_type: DataTypes.STRING,
  platform_id: DataTypes.STRING,
  payment_method_id: DataTypes.STRING,
  payer_first_name: DataTypes.STRING,
  payer_last_name: DataTypes.STRING,
  payer_phone: DataTypes.STRING,
  payer_identification_number: DataTypes.STRING,
  transaction_details_total_paid: DataTypes.DECIMAL,
  transaction_details_net_received: DataTypes.DECIMAL,
  shipping_amount: DataTypes.DECIMAL
});

module.exports = Notificacion;
