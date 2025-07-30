const { Notificacion } = require('../models');
const axios = require('axios');
const mqtt = require('mqtt');

const MQTT_BROKER = 'mqtt://test.mosquitto.org';
const MERCADOPAGO_ACCESS_TOKEN = process.env.MERCADOPAGO_ACCESS_TOKEN;

const client = mqtt.connect(MQTT_BROKER);
client.on('connect', () => console.log('✅ MQTT conectado'));

function extraerPartesId(id) {
  const regex = /P(\d+).*M(\d+).*E(\d+)/;
  const resultado = id?.match(regex);
  if (resultado) {
    return {
      despuesDeP: resultado[1],
      despuesDeM: resultado[2],
      despuesDeE: resultado[3],
    };
  }
  return null;
}

exports.recibirPago = async (req, res) => {
  console.log('🟢 Webhook recibido:', req.body);

  try {
    const { type, data } = req.body;

    if (type === 'payment' && data?.id) {
      const paymentId = data.id;

      const response = await axios.get(`https://api.mercadopago.com/v1/payments/${paymentId}`, {
        headers: { Authorization: `Bearer ${MERCADOPAGO_ACCESS_TOKEN}` },
        timeout: 10000 // evita que se cuelgue por mucho tiempo
      });

      const paymentDetails = response.data;
      console.log('🔍 Detalles del pago:', paymentDetails);

      const partesId = extraerPartesId(paymentDetails.external_reference);

      await Notificacion.create({
        payment_id: paymentDetails.id,
        status: paymentDetails.status,
        monto: paymentDetails.transaction_amount,
        referencia: paymentDetails.external_reference || 'sin_referencia',
        payment_method: paymentDetails.payment_method?.id,
        currency: paymentDetails.currency_id,
        payer_id: paymentDetails.payer?.id,
        payer_email: paymentDetails.payer?.email || 'sin_email',
        description: paymentDetails.description || 'sin_descripcion',
        status_detail: paymentDetails.status_detail || 'sin_detalle',
        transaction_amount: paymentDetails.transaction_amount,
        installments: paymentDetails.installments,
        payment_type: paymentDetails.payment_type_id,
        order_id: paymentDetails.order?.id,
        order_type: paymentDetails.order?.type,
        platform_id: paymentDetails.platform_id || 'sin_plataforma',
        payment_method_id: paymentDetails.payment_method?.id,
        payer_first_name: paymentDetails.payer?.first_name || 'sin_nombre',
        payer_last_name: paymentDetails.payer?.last_name || 'sin_apellido',
        payer_phone: paymentDetails.payer?.phone?.number || 'sin_telefono',
        payer_identification_number: paymentDetails.payer?.identification?.number || 'sin_identificacion',
        transaction_details_total_paid: paymentDetails.transaction_details?.total_paid_amount || 0,
        transaction_details_net_received: paymentDetails.transaction_details?.net_received_amount || 0,
        shipping_amount: paymentDetails.shipping_amount || 0
      });

      console.log('💾 Notificación guardada en la base de datos');

      if (paymentDetails.status === 'approved' && partesId) {
        const MQTT_TOPIC = `esp32/control_${partesId.despuesDeE}`;
        client.publish(MQTT_TOPIC, JSON.stringify({
          action: 'open',
          Iddeproducto: paymentDetails.external_reference || 'sin_referencia',
          pin: partesId.despuesDeM
        }));
        console.log(`📡 Mensaje MQTT enviado a ${MQTT_TOPIC}`);
      }
    } else {
      console.warn('⚠️ Notificación ignorada (tipo o ID inválido)');
    }
  } catch (error) {
    console.error('❌ Error al procesar el webhook:', error.message || error);
  }

  // 👇 SIEMPRE responde a MercadoPago, aunque haya error
  res.sendStatus(200);
};
