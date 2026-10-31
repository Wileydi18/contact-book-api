const AppError = require('../utils/AppError');

const requireClientId = (req, res, next) => {
  const clientId = req.header('x-client-id');
  if (!clientId) {
    return next(new AppError('Falta el header x-client-id', 400));
  }
  req.clientId = clientId;
  next();
};

module.exports = requireClientId;
