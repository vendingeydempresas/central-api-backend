// 📁 controllers/verificacionController.js
const { Notificacion } = require('../models');
const sequelize = require('../config/database');

exports.verificarTransaccion = async (req, res) => {
  const referencia = req.params.referencia;

  try {
    // 1. Buscar en la tabla Notificacion (pago recibido)
    const pago = await Notificacion.findOne({
      where: { referencia },
      order: [['createdAt', 'DESC']]
    });

    // 2. Buscar si se envió el mensaje MQTT
    const [mqttLog] = await sequelize.query(
      `SELECT * FROM mqtt_logs WHERE referencia = :referencia ORDER BY enviado_at DESC LIMIT 1`,
      {
        replacements: { referencia },
        type: sequelize.QueryTypes.SELECT
      }
    );

    const response = {
      referencia,
      pago_encontrado: !!pago,
      status_pago: pago?.status || null,
      monto: pago?.monto || null,
      metodo: pago?.payment_method || null,
      mqtt_enviado: !!mqttLog,
      mqtt_topic: mqttLog?.topic || null,
      mqtt_payload: mqttLog?.payload ? JSON.parse(mqttLog.payload) : null,
      fecha_envio_mqtt: mqttLog?.enviado_at || null
    };

    res.json(response);
  } catch (error) {
    console.error('❌ Error verificando transacción:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
};
