const express = require('express');
const { createTransaction } = require('./transbank');  // Asumiendo que tienes esta función en transbank.js
const { WebpayPlus, Options, Environment } = require('transbank-sdk');
const app = express();
const PORT = process.env.PORT || 3000;

// Configuración de Transbank
const options = new Options(
  '597055555532', // Código de comercio
  '579B532A7440BB0C9079DED94D31EA1615BACEB56610332264630D42D0A36B1C', // API Key
  Environment.Integration
);

app.use(express.urlencoded({ extended: true })); // Para leer datos en el body de las solicitudes
app.use(express.json());  // Middleware para manejar JSON

// Define BASE_URL para usar en los redireccionamientos
const BASE_URL = "https://integracion-transbank.onrender.com";  // Actualiza a la URL correcta de tu servidor

// Ruta para manejar la transacción de pago
app.get('/pago', async (req, res) => {
  const data = req.query.data;
  if (!data) {
    return res.status(400).send('Datos de pago no recibidos');
  }

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
  const returnUrl = `${BASE_URL}/retorno`; // Usa BASE_URL aquí

  try {
    const { url, token } = await createTransaction({
      buyOrder,
      sessionId,
      amount,
      returnUrl,
    });

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
});

// Ruta para manejar el retorno después del pago
app.all('/retorno', async (req, res) => {
  const body = req.body || {};
  const query = req.query || {};

  const token_ws = body.token_ws || query.token_ws;

  if (token_ws) {
    try {
      const transaction = new WebpayPlus.Transaction(options);
      const result = await transaction.commit(token_ws);  // Confirmamos la transacción con Webpay

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
      console.error('Error en commit:', error);
      res.status(500).send('Error al confirmar la transacción.');
    }
  } else {
    res.status(400).send("⚠️ No se recibió información válida de Transbank.");
  }
});

// Inicia el servidor
app.listen(PORT, () => {
  console.log(`Servidor escuchando en puerto ${PORT}`);
});
