// routes/pagos.js
import express from "express";
import { crearLinkMercadoPago } from "../controllers/pagoController.js";

const router = express.Router();

router.post("/create-mp-link", crearLinkMercadoPago);

export default router;
