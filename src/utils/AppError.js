// Error "operacional": uno que esperamos y queremos mostrarle al cliente
// (Un bug interno, esto no lo queremos mostrar).
class AppError extends Error {
  constructor(message, statusCode) {
    super(message);
    this.statusCode = statusCode;
    this.isOperational = true;
    Error.captureStackTrace(this, this.constructor);
  }
}

module.exports = AppError;