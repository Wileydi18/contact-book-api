const AppError = require('../utils/AppError');

// Autorización: ¿puedes hacer esto? Fábrica de middlewares: recibe los roles
// permitidos y DEVUELVE un middleware.
// checkRole('admin') solo admin · checkRole('manager', 'admin') ambos manager O admin
// Debe ir DESPUÉS de verifyToken (necesita req.user).
const checkRole = (...allowedRoles) => (req, res, next) => {
  // Red de seguridad: si alguien lo usa sin verifyToken antes, 401 y no un 500
  if (!req.user) {
    return next(new AppError('Token requerido', 401));
  }

  // Sé quién eres, pero tu rol no alcanza para esta acción debe dar 403 
  if (!allowedRoles.includes(req.user.role)) {
    return next(new AppError('No tienes permisos', 403));
  }

  next();
};

module.exports = checkRole;
