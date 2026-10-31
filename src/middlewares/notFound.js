const AppError = require('../utils/AppError');

// Se ejecuta cuando ninguna ruta anterior coincidacon la peticion.
const notFound = (req, res, next) => {
  next(new AppError(`Ruta no encontrada: ${req.method} ${req.originalUrl}`, 404));
};

module.exports = notFound;
