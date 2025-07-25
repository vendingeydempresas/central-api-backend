const { createTransaction, commitTransaction } = require('../services/transbankService');

const BASE_URL = "https://central-api-backend.onrender.com/transbank"; // Cambia si tienes otro dominio

exports.iniciarPago = async (req, res) => {
  const data = req.query.data;
  if (!data) return res.status(400).send('Datos de pago no recibidos');

  let producto;
  try {
    producto = JSON.parse(decodeURIComponent(data));
  } catch (err) {
    return res.status(400).send('Error al procesar los datos del pago');
  }

  const { title, price } = producto;
  const buyOrder = `order_${Date.now()}`;
  const sessionId = `session_${Math.floor(Math.random() * 100000)}`;
  const amount = price;
  const returnUrl = `${BASE_URL}/retorno`;

  try {
    const { url, token } = await createTransaction({ buyOrder, sessionId, amount, returnUrl });
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
      res.send(`
        <html>
          <body>
            <h1>✅ Transacción exitosa</h1>
            <p>Orden: ${result.buy_order}</p>
            <p>Monto: ${result.amount}</p>
            <p>Estado: ${result.status}</p>
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
