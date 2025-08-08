// controllers/transbankController.js
const { createTransaction, commitTransaction } = require('../services/transbankService');
const { Notificacion } = require('../models');
const mqtt = require('mqtt');
const sequelize = require('../config/database');

// ===================== MQTT CLIENT (singleton) =====================
const MQTT_BROKER = process.env.MQTT_URL || 'mqtt://test.mosquitto.org';
let mqttClient;
function getMqttClient() {
  if (mqttClient && mqttClient.connected) return mqttClient;
  mqttClient = mqtt.connect(MQTT_BROKER, {
    username: process.env.MQTT_USER,
    password: process.env.MQTT_PASS,
    reconnectPeriod: 3000,
    connectTimeout: 10000,
  });
  mqttClient.on('connect', () => console.log('✅ [MQTT] Conectado'));
  mqttClient.on('reconnect', () => console.log('↻ [MQTT] Reintentando...'));
  mqttClient.on('error', (e) => console.error('❌ [MQTT] Error:', e.message));
  return mqttClient;
}

// ===================== HELPERS =====================
/** Extrae { id_producto, maquina, servo } de P<id>M<maquina>E<servo>[T...] */
function extraerPartesId(ref) {
  // Acepta un sufijo T... opcional para unicidad del buyOrder
  const m = String(ref || '').match(/^P(\w+)M(\d+)E(\d+)(?:T.*)?$/);
  return m ? { id_producto: m[1], maquina: Number(m[2]), servo: Number(m[3]) } : null;
}

const BASE_URL = process.env.BASE_URL || 'https://central-api-backend.onrender.com/transbank';

// ===================== INICIAR PAGO =====================
exports.iniciarPago = async (req, res) => {
  const data = req.query.data;
  if (!data) return res.status(400).send('Datos de pago no recibidos');

  let producto;
  try {
    producto = JSON.parse(decodeURIComponent(data));
  } catch (err) {
    console.error('Error parseando data:', err);
    return res.status(400).send('Error al procesar los datos del pago');
  }

  const { title, price, external_reference } = producto || {};
  if (!external_reference || !price) {
    return res.status(400).send('Faltan campos: external_reference o price');
  }

  // ✅ buyOrder corto + único + parseable: P...M...E...T<timestamp_base36>
  const buyOrder = `${external_reference}T${Date.now().toString(36)}`;
  const sessionId = `session_${Math.floor(Math.random() * 100000)}`;
  const amount = price;
  const returnUrl = `${BASE_URL}/retorno`;

  try {
    const { url, token } = await createTransaction({ buyOrder, sessionId, amount, returnUrl });
    // Auto-post a Webpay
    res.send(`
      <html>
        <body onload="document.forms[0].submit()">
          <form action="${url}" method="POST">
            <input type="hidden" name="token_ws" value="${token}" />
          </form>
        </body>
      </html>
    `);
  } catch (error) {
    console.error('Error creando transacción:', error);
    res.status(500).send('Error en el servidor');
  }
};

// ===================== RETORNO (COMMIT) =====================
exports.retornoPago = async (req, res) => {
  const body = req.body || {};
  const query = req.query || {};
  const token_ws = body.token_ws || query.token_ws;
  const tbk_token = body.TBK_TOKEN || query.TBK_TOKEN;

  // Caso normal: token_ws => hacer commit
  if (token_ws) {
    try {
      const result = await commitTransaction(token_ws);
      const referencia = result?.buy_order; // ej: P...M...E...Tlqp5p1x
      const partes = extraerPartesId(referencia);

      // 1) Guardar notificación (ajusta campos si quieres)
      try {
        await Notificacion.create({
          payment_id: result.buy_order,
          status: result.status,
          monto: result.amount,
          referencia,
          payment_method: 'transbank',
          currency: 'CLP',
          payer_id: 'no_aplica',
          payer_email: 'no_aplica',
          description: 'Pago con Transbank',
          status_detail: 'AUTHORIZED',
          transaction_amount: result.amount,
          installments: 0,
          order_id: result.buy_order,
          order_type: 'webpay_plus',
          platform_id: 'webpay',
          payment_method_id: 'webpay_plus',
          payer_first_name: 'no_aplica',
          payer_last_name: 'no_aplica',
          payer_phone: 'no_aplica',
          payer_identification_number: 'no_aplica',
          transaction_details_total_paid: result.amount,
          transaction_details_net_received: result.amount,
          shipping_amount: 0
        });
        console.log('💾 Notificación guardada');
      } catch (e) {
        console.error('❌ Error guardando Notificacion:', e.message || e);
      }

      // 2) Enviar MQTT si está autorizado y referencia válida
      if (String(result.status).toUpperCase() === 'AUTHORIZED' && partes) {
        const client = getMqttClient();

        // Topic: esp32/control_<E>
        const topic = `esp32/control_${partes.servo}`;
        // pin = M (número después de la M)
        const payloadObj = {
          action: 'ABRIR_LOCKER',
          referencia,                 // P...M...E...T...
          pin: partes.maquina,        // <-- pin = M
          servo: partes.servo,        // para trazabilidad
          id_producto: partes.id_producto,
          ts: new Date().toISOString()
        };
        const payload = JSON.stringify(payloadObj);

        // Publicar con confirmación
        await new Promise((resolve, reject) => {
          client.publish(topic, payload, { qos: 1, retain: false }, (err) => {
            if (err) return reject(err);
            return resolve();
          });
        });
        console.log(`📡 MQTT publicado en ${topic} ->`, payload);

        // 3) Guardar log en mqtt_logs
        try {
          // Preferencia: JSONB
          await sequelize.query(
            `INSERT INTO mqtt_logs (referencia, topic, payload) VALUES (:referencia, :topic, :payload::jsonb)`,
            { replacements: { referencia, topic, payload } }
          );
          console.log('📝 Log MQTT guardado (jsonb)');
        } catch (e) {
          // Si la columna es TEXT, plan B:
          await sequelize.query(
            `INSERT INTO mqtt_logs (referencia, topic, payload) VALUES (:referencia, :topic, :payload)`,
            { replacements: { referencia, topic, payload } }
          );
          console.log('📝 Log MQTT guardado (texto)');
        }
      } else {
        console.warn('⚠️ No se envía MQTT. Status:', result?.status, 'Partes:', partes);
      }

      // 4) Respuesta al usuario
      res.send(`
        <html>
          <body>
            <h1>✅ Transacción procesada</h1>
            <p>Orden: ${result.buy_order}</p>
            <p>Monto: ${result.amount}</p>
            <p>Estado: ${result.status}</p>
            <p>Referencia: ${referencia || '—'}</p>
            <p>Token: ${token_ws}</p>
          </body>
        </html>
      `);
    } catch (error) {
      console.error('❌ Error en commit:', error);
      res.status(500).send('Error al confirmar la transacción.');
    }
    return;
  }

  // Caso cancelación: TBK_TOKEN
  if (tbk_token) {
    const orden = body.TBK_ORDEN_COMPRA || query.TBK_ORDEN_COMPRA || '—';
    const sesion = body.TBK_ID_SESION || query.TBK_ID_SESION || '—';
    res.send(`
      <html>
        <body>
          <h1>❌ Transacción cancelada por el usuario</h1>
          <p>Orden: ${orden}</p>
          <p>Sesión: ${sesion}</p>
          <p>Token: ${tbk_token}</p>
        </body>
      </html>
    `);
    return;
  }

  // Sin info válida
  res.status(400).send('⚠️ No se recibió información válida de Transbank.');
};
