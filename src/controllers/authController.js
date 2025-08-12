// controllers/authController.js
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { Usuario } = require('../models');

const JWT_SECRET = process.env.JWT_SECRET || 'cambia_esto';
const JWT_EXPIRES_IN = '10s';

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
      email,
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

    const user = await Usuario.findOne({ where: { email } });
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

module.exports = { register, login };
