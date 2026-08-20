const jwt = require('jsonwebtoken');
const User = require('../models/User');

/**
 * @desc Middleware que verifica el token JWT en el header Authorization
 * Consulta la BD para validar que el usuario siga existiendo y esté activo
 * Adjunta los datos del usuario a req.user si es válido
 */
const verifyToken = async (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token      = authHeader && authHeader.split(' ')[1]; // Bearer TOKEN

  if (!token) {
    return res.status(401).json({ error: 'Acceso denegado. Token no proporcionado' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const usuario = await User.findById(decoded.id);

    if (!usuario) {
      return res.status(401).json({ error: 'Token inválido o expirado' });
    }
    if (!usuario.activo) {
      return res.status(401).json({ error: 'Tu cuenta está desactivada. Contacta al administrador.' });
    }

    req.user = { id: usuario._id.toString(), rol: usuario.rol };
    next();
  } catch (error) {
    return res.status(401).json({ error: 'Token inválido o expirado' });
  }
};

module.exports = verifyToken;
