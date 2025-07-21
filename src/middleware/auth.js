const jwt = require('jsonwebtoken');
const { Usuario } = require('../models');

module.exports = async function (req, res, next) {
    const token = req.headers['authorization'];
    if (!token) return res.status(403).json({ message: 'Token requerido' });
    try {
        const decoded = jwt.verify(token.replace('Bearer ', ''), process.env.JWT_SECRET);
        const usuario = await Usuario.findByPk(decoded.id);
        if (!usuario) return res.status(401).json({ message: 'Token inválido' });
        req.user = usuario;
        next();
    } catch {
        return res.status(401).json({ message: 'Token inválido' });
    }
};
