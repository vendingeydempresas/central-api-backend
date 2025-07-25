// controllers/pagoController.js
const { crearLinkMercadoPago } = require('../config/mercadopago');
const { createTransaction } = require('../config/transbank');

// Función para crear link de pago de Mercado Pago
const crearLinkMercadoPagoController = async (req, res) => {
  const { title, quantity, price, description, external_reference } = req.body;
  try {
    const link = await crearLinkMercadoPago({ title, quantity, price, description, external_reference });
    res.status(200).json(link);
  } catch (error) {
    console.error('Error al crear el link de Mercado Pago:', error);
    res.status(500).json({ error: error.message });
  }
};

// Función para crear transacción de Transbank
const crearTransaccionTransbankController = async (req, res) => {
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
  const returnUrl = `${process.env.BASE_URL}/retorno`;  // Usar base URL del entorno

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
    console.error('Error creando transacción en Transbank:', error);
    res.status(500).send('Error al crear la transacción');
  }
};

module.exports = { crearLinkMercadoPagoController, crearTransaccionTransbankController };
