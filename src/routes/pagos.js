import express from "express";
import { crearLinkMercadoPagoController, crearTransaccionTransbankController } from "../controllers/pagoController.js"; // Importar las funciones correctas

const router = express.Router();

// Ruta para crear el link de pago de Mercado Pago
router.post("/create-mp-link", crearLinkMercadoPagoController);

// Ruta para crear el link de pago de Webpay (Transbank)
router.post("/create-tbk-link", crearTransaccionTransbankController);

export default router; // Exportar el router correctamente
