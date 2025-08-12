// controllers/authController.js
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { Usuario } = require('../models');
const { OAuth2Client } = require('google-auth-library');

const JWT_SECRET = process.env.JWT_SECRET || 'cambia_esto';
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || '7d';
const GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID;
const googleClient = GOOGLE_CLIENT_ID ? new OAuth2Client(GOOGLE_CLIENT_ID) : null;

const sanitize = (u) => ({
  id: u.id,
  nombre: u.nombre,
  email: u.email,
  sexo: u.sexo || null,
  fechaNacimiento: u.fechaNacimiento || null,
});

// POST /api/auth/register
async function register(req, res) {
  try {
    const body = req.body || {};
    const { nombre, email, password, sexo, fechaNacimiento } = body;

    if (!nombre || !email || !password) {
      return res.status(400).json({ error: 'nombre, email y password son requeridos' });
    }

    const existe = await Usuario.findOne({ where: { email } });
    if (existe) return res.status(409).json({ error: 'Email ya registrado' });

    const hash = await bcrypt.hash(password, 10);
    const user = await Usuario.create({
      nombre,
      email: email.toLowerCase(),
      password: hash, // tu modelo usa 'password'
      sexo: sexo || null,
      fechaNacimiento: fechaNacimiento || null,
    });

    const token = jwt.sign({ id: user.id }, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN });
    return res.status(201).json({ token, user: sanitize(user) });
  } catch (e) {
    console.error('REGISTER_ERROR', e);
    return res.status(500).json({ error: 'Error en registro' });
  }
}

// POST /api/auth/login
async function login(req, res) {
  try {
    const body = req.body || {};
    const { email, password } = body;

    if (!email || !password) {
      return res.status(400).json({ error: 'email y password son requeridos' });
    }

    const user = await Usuario.findOne({ where: { email: email.toLowerCase() } });
    if (!user) return res.status(401).json({ error: 'Credenciales inválidas' });

    const ok = await bcrypt.compare(password, user.password);
    if (!ok) return res.status(401).json({ error: 'Credenciales inválidas' });

    const token = jwt.sign({ id: user.id }, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN });
    return res.json({ token, user: sanitize(user) });
  } catch (e) {
    console.error('LOGIN_ERROR', e);
    return res.status(500).json({ error: 'Error en login' });
  }
}

// POST /api/auth/google   { idToken }
async function loginWithGoogle(req, res) {
  try {
    if (!googleClient || !GOOGLE_CLIENT_ID) {
      return res.status(500).json({ error: 'Google Sign-In no configurado (GOOGLE_CLIENT_ID faltante)' });
    }

    const { idToken } = req.body || {};
    if (!idToken) return res.status(400).json({ error: 'idToken requerido' });

    // 1) Verificar token con Google
    const ticket = await googleClient.verifyIdToken({
      idToken,
      audience: GOOGLE_CLIENT_ID,
    });
    const payload = ticket.getPayload();
    if (!payload || !payload.email) {
      return res.status(401).json({ error: 'Token de Google inválido' });
    }

    const email = payload.email.toLowerCase();
    const nombre = payload.name || email.split('@')[0];

    // 2) Buscar o crear usuario (sin password)
    let user = await Usuario.findOne({ where: { email } });
    if (!user) {
      user = await Usuario.create({
        nombre,
        email,
        password: null,      // social login
        sexo: null,
        fechaNacimiento: null,
      });
    }

    // 3) Emitir JWT como siempre
    const token = jwt.sign({ id: user.id }, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN });

    return res.json({ token, user: sanitize(user) });
  } catch (e) {
    console.error('GOOGLE_LOGIN_ERROR', e);
    return res.status(500).json({ error: 'Error con Google Sign-In' });
  }
}

module.exports = { register, login, loginWithGoogle };
