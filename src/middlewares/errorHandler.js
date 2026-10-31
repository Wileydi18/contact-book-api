// Middleware de manejo de errores: se reconoce por tener 4 parámetros.
const errorHandler = (err, req, res, next) => {
  const statusCode = err.statusCode || 500;
  const message = err.isOperational ? err.message : 'Error interno del servidor';

  if (!err.isOperational) {
    console.error(err); // errores no esperados sí se loguean completos
  }

  res.status(statusCode).json({
    error: message,
  });
};

module.exports = errorHandler;