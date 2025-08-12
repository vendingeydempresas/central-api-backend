// routes/auth.js
const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');

router.post('/auth/register', authController.register);
router.post('/auth/login', authController.login);

// NUEVO:
router.post('/auth/google', authController.loginWithGoogle);

module.exports = router;
