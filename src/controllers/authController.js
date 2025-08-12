// controllers/authController.js
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { Usuario } = require('../models');

const JWT_SECRET = process.env.JWT_SECRET || 'cambia_esto';
const JWT_EXPIRES_IN = '7d';

exports.register = async (req, res) => {
  try {
    const { nombre, email, password, sexo, fechaNacimiento } = req.body;
    if (!nombre || !email || !password) {
      return res.status(400).json({ error: 'nombre, email y password son requeridos' });
    }

    const existe = await Usuario.findOne({ where: { email } });
    if (existe) return res.status(409).json({ error: 'Email ya registrado' });

    const hash = await bcrypt.hash(password, 10);
    const user = await Usuario.create({
      nombre,
      email,
      password: hash,             // guardas el hash aquí
      sexo: sexo || null,
      fechaNacimiento: fechaNacimiento || null
    });

    const token = jwt.sign({ id: user.id }, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN });

    return res.status(201).json({
      token,
      user: {
        id: user.id,
        nombre: user.nombre,
        email: user.email,
        sexo: user.sexo,
        fechaNacimiento: user.fechaNacimiento
      }
    });
  } catch (e) {
    console.error('REGISTER_ERROR', e);
    return res.status(500).json({ error: 'Error en registro' });
  }
};
