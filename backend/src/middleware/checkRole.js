/**
 * @desc Middleware que verifica si el usuario tiene el rol requerido
 * @param  {...string} roles - Roles permitidos para la ruta
 */
const checkRole = (...roles) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({ error: 'Usuario no autenticado' });
    }
    if (!roles.includes(req.user.rol)) {
      return res.status(403).json({ error: 'No tienes permisos para realizar esta acción' });
    }
    next();
  };
};

module.exports = checkRole;