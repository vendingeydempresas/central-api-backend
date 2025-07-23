require('dotenv').config({ path: '../.env' }); // ✅ Esto carga el .env desde un nivel arriba
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const { sequelize } = require('./models');

// Rutas
const productoRoutes = require('./routes/productos');
const eventoRoutes = require('./routes/eventos');
const webhookRoutes = require('./routes/webhook');
const pagosRoutes = require('./routes/pagos').default;
const detallecompraRoutes = require('./routes/detallecompra'); // Nueva ruta para productos

console.log('productoRoutes:', typeof productoRoutes);
console.log('eventoRoutes:', typeof eventoRoutes);

const app = express();
app.use(cors());
app.use(bodyParser.json());

// Rutas de la API
app.use('/api/productos', productoRoutes);
app.use('/api/eventos', eventoRoutes);
app.use('/api/webhook', webhookRoutes);
app.use("/api", pagosRoutes); // Quedará como /api/create-mp-link
app.use('/api/detallecompra', detallecompraRoutes); // Nueva ruta para productos

// Sincronizar la base de datos
sequelize.sync({ alter: true }).then(() => console.log('DB sincronizada'));

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Servidor en puerto ${PORT}`));
