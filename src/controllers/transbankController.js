const { WebpayPlus, Options, Environment } = require('transbank-sdk');
const options = new Options(
  '597055555532', // Código de comercio
  '579B532A7440BB0C9079DED94D31EA1615BACEB56610332264630D42D0A36B1C', // API Key
  Environment.Integration // Especificamos el ambiente de integración
);

const BASE_URL = "https://central-api-backend.onrender.com"; // Cambia a tu URL de producción

// Función para manejar el retorno después del pago
const retornoTransaccion = async (req, res) => {
  const body = req.body || {};
  
  console.log('Cuerpo recibido:', body);  // Agrega este log para ver el cuerpo completo de la solicitud

  // Si recibimos el parámetro 'data' dentro del cuerpo
  const parsedData = body.data;
  
  if (!parsedData) {
    return res.status(400).send("⚠️ No se recibió información válida de Transbank.");
  }

  // Mostrar los detalles del parámetro data (para ver qué estamos recibiendo)
  console.log('Datos recibidos:', parsedData);

  const token_ws = body.token_ws; // Token enviado por Transbank
  const tbk_token = body.TBK_TOKEN; // Si el pago fue cancelado

  if (token_ws) {
    try {
      const transaction = new WebpayPlus.Transaction(options);
      const result = await transaction.commit(token_ws); // Confirmamos la transacción con Webpay

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
  } else if (tbk_token) {
    const orden = body.TBK_ORDEN_COMPRA;
    const sesion = body.TBK_ID_SESION;

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

module.exports = { retornoTransaccion };
