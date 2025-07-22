// controllers/pagoController.js
const ACCESS_TOKEN = process.env.MERCADOPAGO_ACCESS_TOKEN; // Reemplaza con tu token real

export const crearLinkMercadoPago = async (req, res) => {
  const { title, quantity, price, description, external_reference } = req.body;
  console.log("Datos recibidos:", req.body);

  try {
    const response = await fetch("https://api.mercadopago.com/checkout/preferences", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${ACCESS_TOKEN}`,
      },
      body: JSON.stringify({
        items: [{
          title,
          quantity: Number(quantity),
          currency_id: "CLP",
          unit_price: Number(price),
          description,
          external_reference,
        }],
        external_reference,
      }),
    });

    if (!response.ok) {
      const errorBody = await response.text();
      console.error("Error en Mercado Pago API:", errorBody);
      return res.status(response.status).json({ error: errorBody });
    }

    const data = await response.json();
    res.status(200).json({ init_point: data.init_point });
  } catch (error) {
    console.error("Error interno en API:", error);
    res.status(500).json({ error: error.message });
  }
};

