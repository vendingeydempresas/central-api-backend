const { Notificacion } = require('../models');
const axios = require('axios');
const mqtt = require('mqtt');
const crypto = require('crypto');

const MQTT_BROKER = process.env.MQTT_BROKER_URL || 'mqtt://test.mosquitto.org';
const MERCADOPAGO_ACCESS_TOKEN = process.env.MERCADOPAGO_ACCESS_TOKEN;
const MERCADOPAGO_WEBHOOK_SECRET = process.env.MERCADOPAGO_WEBHOOK_SECRET;

const client = mqtt.connect(MQTT_BROKER, {
  username: process.env.MQTT_USER,
  password: process.env.MQTT_PASSWORD,
});
client.on('connect', () => console.log('✅ MQTT conectado'));

// Valida que la notificación realmente venga de MercadoPago
function validarFirma(req) {
  const xSignature = req.headers['x-signature'];
  const xRequestId = req.headers['x-request-id'];
  if (!xSignature || !xRequestId || !MERCADOPAGO_WEBHOOK_SECRET) return false;

  const parts = xSignature.split(',');
  let ts, hash;
  parts.forEach((part) => {
    const [key, value] = part.split('=');
    if (key?.trim() === 'ts') ts = value?.trim();
    if (key?.trim() === 'v1') hash = value?.trim();
  });
  if (!ts || !hash) return false;

  const dataId = req.body?.data?.id || '';
  const manifest = `id:${dataId};request-id:${xRequestId};ts:${ts};`;

  const hmac = crypto.createHmac('sha256', MERCADOPAGO_WEBHOOK_SECRET);
  hmac.update(manifest);
  const calculatedHash = hmac.digest('hex');

  return calculatedHash === hash;
}

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

  // 1. Validar que la notificación venga realmente de MercadoPago
  if (!validarFirma(req)) {
    console.warn('⛔ Firma inválida, notificación rechazada');
    return res.sendStatus(401);
  }

  try {
    const { type, data } = req.body;

    // ── Caso A: pago online normal (Checkout Pro) ──
    if (type === 'payment' && data?.id) {
      await procesarPagoOnline(data.id);

    // ── Caso B: máquina física Point ──
    } else if (type === 'order' && data?.id) {
      await procesarOrdenPoint(data);

    } else {
      console.warn('⚠️ Notificación ignorada (tipo o ID inválido):', type);
    }
  } catch (error) {
    console.error('❌ Error al procesar el webhook:', error.message || error);
  }

  // 👇 SIEMPRE responde a MercadoPago, aunque haya error
  res.sendStatus(200);
};

// Procesa una notificación de pago online (Checkout Pro)
async function procesarPagoOnline(paymentId) {
  const yaExiste = await Notificacion.findOne({ where: { payment_id: paymentId } });
  if (yaExiste) {
    console.log('🔁 Pago ya procesado anteriormente, se ignora duplicado');
    return;
  }

  const response = await axios.get(`https://api.mercadopago.com/v1/payments/${paymentId}`, {
    headers: { Authorization: `Bearer ${MERCADOPAGO_ACCESS_TOKEN}` },
    timeout: 10000
  });

  const paymentDetails = response.data;
  console.log('🔍 Detalles del pago:', paymentDetails);

  await guardarNotificacionYDespachar({
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
    shipping_amount: paymentDetails.shipping_amount || 0,
    esAprobado: paymentDetails.status === 'approved',
  });
}

// Procesa una notificación de orden Point (máquina física)
async function procesarOrdenPoint(data) {
  // El payment_id real de Point viene dentro de transactions.payments[0].id (formato PAY...)
  const pagoPoint = data.transactions?.payments?.[0];
  const paymentId = pagoPoint?.id || data.id; // fallback al order id si no viene el pago

  const yaExiste = await Notificacion.findOne({ where: { payment_id: paymentId } });
  if (yaExiste) {
    console.log('🔁 Orden Point ya procesada anteriormente, se ignora duplicado');
    return;
  }

  // Status de la orden: "processed" + "accredited" = pago aprobado en el dispositivo
  const aprobado = data.status === 'processed' && data.status_detail === 'accredited';

  console.log(`🔍 Orden Point recibida — status: ${data.status}, detail: ${data.status_detail}`);

  await guardarNotificacionYDespachar({
    payment_id: paymentId,
    status: data.status,
    monto: pagoPoint?.amount || data.total_paid_amount || 0,
    referencia: data.external_reference || 'sin_referencia',
    payment_method: pagoPoint?.payment_method?.id || 'point',
    currency: 'CLP',
    payer_id: null,
    payer_email: 'sin_email',
    description: 'Pago con máquina Point',
    status_detail: data.status_detail || 'sin_detalle',
    transaction_amount: pagoPoint?.amount || data.total_paid_amount || 0,
    installments: pagoPoint?.payment_method?.installments || 1,
    payment_type: pagoPoint?.payment_method?.type || 'point',
    order_id: data.id,
    order_type: 'point',
    platform_id: 'point',
    payment_method_id: pagoPoint?.payment_method?.id || 'point',
    payer_first_name: 'sin_nombre',
    payer_last_name: 'sin_apellido',
    payer_phone: 'sin_telefono',
    payer_identification_number: 'sin_identificacion',
    transaction_details_total_paid: pagoPoint?.paid_amount || 0,
    transaction_details_net_received: 0,
    shipping_amount: 0,
    esAprobado: aprobado,
  });
}

// Guarda la notificación en BD y, si el pago fue aprobado, despacha el producto vía MQTT
async function guardarNotificacionYDespachar(datos) {
  const { esAprobado, ...camposNotificacion } = datos;

  await Notificacion.create(camposNotificacion);
  console.log('💾 Notificación guardada en la base de datos');

  if (esAprobado) {
    const partesId = extraerPartesId(camposNotificacion.referencia);
    if (partesId) {
      const MQTT_TOPIC = `esp32/control_${partesId.despuesDeE}`;
      client.publish(MQTT_TOPIC, JSON.stringify({
        action: 'open',
        Iddeproducto: camposNotificacion.referencia,
        pin: partesId.despuesDeM
      }));
      console.log(`📡 Mensaje MQTT enviado a ${MQTT_TOPIC}`);
    } else {
      console.warn('⚠️ No se pudo extraer producto/motor/vending del external_reference:', camposNotificacion.referencia);
    }
  }
}
