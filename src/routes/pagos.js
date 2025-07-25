// routes/pagos.js
import express from "express";
import { crearLinkMercadoPago, crearLinkTransbank } from "../controllers/pagoController.js"; // Importamos ambas funciones

const router = express.Router();

// Ruta para crear el link de pago de Mercado Pago
router.post("/create-mp-link", crearLinkMercadoPago);

// Ruta para crear el link de pago de Webpay (Transbank)
router.post("/create-tbk-link", crearLinkTransbank);

export default router;

