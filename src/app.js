require('dotenv').config({ path: '../.env' }); // ✅ Esto carga el .env desde un nivel arriba
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const { sequelize } = require('./models');

// const authRoutes = require('./routes/auth');
// const clienteRoutes = require('./routes/clientes');
const productoRoutes = require('./routes/productos');
// const ventaRoutes = require('./routes/ventas');
const eventoRoutes = require('./routes/eventos');
const webhookRoutes = require('./routes/webhook');

console.log('productoRoutes:', typeof productoRoutes);
console.log('eventoRoutes:', typeof eventoRoutes);


const app = express();
app.use(cors());
app.use(bodyParser.json());

// app.use('/api/auth', authRoutes);
// app.use('/api/clientes', clienteRoutes);
app.use('/api/productos', productoRoutes);
// app.use('/api/ventas', ventaRoutes);
app.use('/api/eventos', eventoRoutes);
app.use('/api/webhook', webhookRoutes);

sequelize.sync({ alter: true }).then(() => console.log('DB sincronizada'));

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Servidor en puerto ${PORT}`));
