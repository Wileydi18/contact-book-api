const AppError = require('../utils/AppError');

const API_KEY = 'talendig-123';

const validateApiKey = (req, res, next) => {
  const apiKey = req.header('x-api-key');
  if (apiKey !== API_KEY) {
    return next(new AppError('API key inválida', 401));
  }
  next();
};

module.exports = validateApiKey;
