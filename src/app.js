import dotenv from 'dotenv'; // Cargar el .env
import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import { sequelize } from './models/index.js';

// Rutas
import productoRoutes from './routes/productos';
import eventoRoutes from './routes/eventos';
import webhookRoutes from './routes/webhook';
import pagoRoutes from './routes/pagos';
import detallecompraRoutes from './routes/detallecompra';

// Cargar el archivo .env
dotenv.config({ path: '../.env' }); 

const app = express();

app.use(cors());
app.use(bodyParser.json()); // Middleware para parsear JSON

// Rutas de la API
app.use('/api/productos', productoRoutes);
app.use('/api/eventos', eventoRoutes);
app.use('/api/webhook', webhookRoutes);
app.use("/api", pagoRoutes); // Quedará como /api/create-mp-link
app.use('/api/detallecompra', detallecompraRoutes); // Ruta para manejar detalle de compra

// Sincronizar la base de datos
sequelize.sync({ alter: true }).then(() => console.log('DB sincronizada'));

// Configuración del puerto
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Servidor en puerto ${PORT}`));
