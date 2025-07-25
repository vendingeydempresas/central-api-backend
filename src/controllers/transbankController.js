const { createTransaction } = require('../services/transbank');  // Asumiendo que lo colocamos en services
const { WebpayPlus, Options, Environment } = require('transbank-sdk');
const options = new Options(
  '597055555532',  // Código de comercio
  '579B532A7440BB0C9079DED94D31EA1615BACEB56610332264630D42D0A36B1C', // API Key
  Environment.Integration
);

const BASE_URL = "https://central-api-backend.onrender.com"; // Cambiar al URL de tu API

// Controlador para crear transacciones
const createPayment = async (req, res) => {
  const data = req.body.data;  // Aquí debes pasar los datos desde el cliente
  if (!data) {
    return res.status(400).send('Datos de pago no recibidos');
  }

  let producto;
  try {
    producto = JSON.parse(data); // Decodificar los datos JSON recibidos
  } catch (err) {
    return res.status(400).send('Error al procesar los datos del pago');
  }

  const { title, price } = producto;
  const buyOrder = `order_${Date.now()}`;
  const sessionId = `session_${Math.floor(Math.random() * 100000)}`;
  const amount = price;
  const returnUrl = `${BASE_URL}/transbank/retorno`; // URL para el retorno después del pago

  try {
    const { url, token } = await createTransaction({
      buyOrder,
      sessionId,
      amount,
      returnUrl
    });

    res.send({ url, token });  // Enviar solo la URL y token al frontend
  } catch (error) {
    console.error('Error creando la transacción:', error);
    res.status(500).send('Error en el servidor');
  }
};


// Controlador para manejar el retorno después del pago
const handleReturn = async (req, res) => {
  const { token_ws, TBK_TOKEN } = req.body || req.query;
  
  if (token_ws) {
    try {
      const transaction = new WebpayPlus.Transaction(options);
      const result = await transaction.commit(token_ws); // Confirmar la transacción

      res.send(`
        <html>
          <body>
            <h1>✅ Transacción exitosa</h1>
            <p>Orden: ${result.buy_order}</p>
            <p>Monto: ${result.amount}</p>
            <p>Estado: ${result.status}</p>
            <p>Token: ${token_ws}</p>
            <p>Detalle de la transacción: ${JSON.stringify(result)}</p>
          </body>
        </html>
      `);
    } catch (error) {
      console.error('Error confirmando la transacción:', error);
      res.status(500).send('Error al confirmar la transacción');
    }
  } else if (TBK_TOKEN) {
    const orden = req.body.TBK_ORDEN_COMPRA || req.query.TBK_ORDEN_COMPRA;
    const sesion = req.body.TBK_ID_SESION || req.query.TBK_ID_SESION;

    res.send(`
      <html>
        <body>
          <h1>❌ Transacción cancelada por el usuario</h1>
          <p>Orden: ${orden}</p>
          <p>Sesión: ${sesion}</p>
          <p>Token: ${TBK_TOKEN}</p>
        </body>
      </html>
    `);
  } else {
    res.status(400).send("⚠️ No se recibió información válida de Transbank.");
  }
};

module.exports = {
  createPayment,
  handleReturn
};
