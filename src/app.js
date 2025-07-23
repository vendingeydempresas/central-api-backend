require('dotenv').config({ path: '../.env' }); // ✅ Carga variables del .env desde un nivel arriba
const express = require('express');
const cors = require('cors');
const { sequelize } = require('./models'); // ✅ Importa correctamente desde models/index.js

// Rutas
// const authRoutes = require('./routes/auth');
// const clienteRoutes = require('./routes/clientes');
const productoRoutes = require('./routes/productos');
// const ventaRoutes = require('./routes/ventas');
const eventoRoutes = require('./routes/eventos');
const webhookRoutes = require('./routes/webhook');
const pagosRoutes = require('./routes/pagos').default;

const app = express();

// ✅ Middlewares
app.use(cors());
app.use(express.json()); // ✅ Reemplaza body-parser (no se necesita más)

// ✅ Rutas
// app.use('/api/auth', authRoutes);
// app.use('/api/clientes', clienteRoutes);
app.use('/api/productos', productoRoutes);
// app.use('/api/ventas', ventaRoutes);
app.use('/api/eventos', eventoRoutes);
app.use('/api/webhook', webhookRoutes);
app.use("/api", pagosRoutes); // Ej: /api/create-mp-link

// ✅ Base de datos
sequelize.sync({ alter: true }).then(() => {
  console.log('✅ Base de datos sincronizada');
});

// ✅ Arranque del servidor
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`🚀 Servidor corriendo en puerto ${PORT}`);
});
