const { createTransaction, commitTransaction } = require('../services/transbankService');
const { Notificacion } = require('../models');
const mqtt = require('mqtt');
const sequelize = require('../config/database');


const MQTT_BROKER = 'mqtt://test.mosquitto.org';
const client = mqtt.connect(MQTT_BROKER);
client.on('connect', () => console.log('✅ MQTT conectado (Transbank)'));

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

const BASE_URL = "https://central-api-backend.onrender.com/transbank";

exports.iniciarPago = async (req, res) => {
  const data = req.query.data;
  if (!data) return res.status(400).send('Datos de pago no recibidos');

  let producto;
  try {
    producto = JSON.parse(decodeURIComponent(data));
  } catch (err) {
    return res.status(400).send('Error al procesar los datos del pago');
  }

  const { title, price, external_reference } = producto;
  const buyOrder = `order_${Date.now()}`;
  const sessionId = `session_${Math.floor(Math.random() * 100000)}`;
  const amount = price;
  const returnUrl = `${BASE_URL}/retorno`;

  try {
    const { url, token } = await createTransaction({ buyOrder, sessionId, amount, returnUrl });

    // Guardamos solo en memoria si es necesario, pero no obligatorio
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

exports.retornoPago = async (req, res) => {
  const body = req.body || {};
  const query = req.query || {};
  const token_ws = body.token_ws || query.token_ws;
  const tbk_token = body.TBK_TOKEN || query.TBK_TOKEN;

  if (token_ws) {
    try {
      const result = await commitTransaction(token_ws);
      const referencia = result.buy_order; // usamos buyOrder como ID y referencia base
      const partesId = extraerPartesId(referencia);

      // 🔒 Guardar en tabla Notificacion como con MercadoPago
      await Notificacion.create({
        payment_id: result.buy_order,
        status: result.status,
        monto: result.amount,
        referencia: referencia,
        payment_method: 'transbank',
        currency: 'CLP',
        payer_id: 'no_aplica',
        payer_email: 'no_aplica',
        description: 'Pago con Transbank',
        status_detail: 'no_aplica',
        transaction_amount: result.amount,
        installments: 0,
        payment_type: 'webpay',
        order_id: result.buy_order,
        order_type: 'no_aplica',
        platform_id: 'no_aplica',
        payment_method_id: 'webpay_plus',
        payer_first_name: 'no_aplica',
        payer_last_name: 'no_aplica',
        payer_phone: 'no_aplica',
        payer_identification_number: 'no_aplica',
        transaction_details_total_paid: result.amount,
        transaction_details_net_received: result.amount,
        shipping_amount: 0
      });
      console.log('💾 Notificación de Transbank guardada en la base de datos');

      // 📡 Enviar MQTT si corresponde
if (result.status === 'AUTHORIZED' && partesId) {
  const MQTT_TOPIC = `esp32/control_${partesId.despuesDeE}`;
  const payload = {
    action: 'open',
    Iddeproducto: referencia,
    pin: partesId.despuesDeM
  };

  client.publish(MQTT_TOPIC, JSON.stringify(payload));

  console.log(`📡 Mensaje MQTT enviado a ${MQTT_TOPIC}`);

  // ✅ Agregar este bloque justo aquí
  await sequelize.query(`
    INSERT INTO mqtt_logs (referencia, topic, payload)
    VALUES (:referencia, :topic, :payload)
  `, {
    replacements: {
      referencia,
      topic: MQTT_TOPIC,
      payload: JSON.stringify(payload)
    }
  });
}


      res.send(`
        <html>
          <body>
            <h1>✅ Transacción exitosa</h1>
            <p>Orden: ${result.buy_order}</p>
            <p>Monto: ${result.amount}</p>
            <p>Estado: ${result.status}</p>
            <p>Referencia: ${referencia}</p>
            <p>Token: ${token_ws}</p>
          </body>
        </html>
      `);
    } catch (error) {
      console.error('Error en commit:', error);
      res.status(500).send('Error al confirmar la transacción.');
    }
  } else if (tbk_token) {
    const orden = body.TBK_ORDEN_COMPRA || query.TBK_ORDEN_COMPRA;
    const sesion = body.TBK_ID_SESION || query.TBK_ID_SESION;
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
  } else {
    res.status(400).send("⚠️ No se recibió información válida de Transbank.");
  }
};
