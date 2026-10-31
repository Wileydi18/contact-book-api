const jwt = require('jsonwebtoken');
const AppError = require('../utils/AppError');

// Autenticación: ¿quién eres? Exige un JWT válido en Authorization: Bearer <token>
const verifyToken = (req, res, next) => {
  const authHeader = req.header('Authorization') || '';
  const [scheme, token] = authHeader.split(' ');

  if (scheme !== 'Bearer' || !token) {
    return next(new AppError('Token requerido', 401));
  }

  let payload;
  try {
    payload = jwt.verify(token, process.env.JWT_SECRET);
  } catch (err) {
    // Token alterado o vencido: sin este try/catch llegaría al errorHandler como 500
    return next(new AppError('Token inválido o expirado', 401));
  }

  req.user = { id: payload.sub, role: payload.role };
  next();
};

module.exports = verifyToken;
