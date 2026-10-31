const bcrypt = require('bcryptjs');
const { validationResult } = require('express-validator');
const usersData = require('../data/users.data');
const AppError = require('../utils/AppError');
const { signToken } = require('../utils/jwt');

// En Express 4 los errores de funciones async no llegan solos al errorHandler:
// por eso try/catch + next(err).
const register = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return next(new AppError(errors.array()[0].msg, 400));
    }

    // Solo leemos name, email y password: si el body trae "role", se ignora
    const { name, email, password } = req.body;

    if (usersData.findByEmail(email)) {
      return next(new AppError('Ya existe un usuario con ese correo', 409));
    }

    // bcrypt: nunca guardamos la contraseña en texto plano. TENER MUUYYY EN CUENTAS
    const passwordHash = await bcrypt.hash(password, 10);
    const user = usersData.create({ name, email, passwordHash }); // role: 'member'

    res.status(201).json({ user: usersData.toSafeUser(user), token: signToken(user) });
  } catch (err) {
    next(err);
  }
};

const login = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return next(new AppError(errors.array()[0].msg, 400));
    }

    const { email, password } = req.body;
    const user = usersData.findByEmail(email);
    const passwordMatches = user && (await bcrypt.compare(password, user.passwordHash));

    // Mismo 401 si el correo no existe o si la contraseña no coincide, NUNCA DECIR CUAL ES EL ERRRO EXACTAMENTE, PUEDE SER UN ATAQUE
    if (!passwordMatches) {
      return next(new AppError('Credenciales inválidas', 401));
    }

    res.json({ user: usersData.toSafeUser(user), token: signToken(user) });
  } catch (err) {
    next(err);
  }
};

// GET /auth/me: verifyToken ya puso req.user = { id, role }
const me = (req, res, next) => {
  const user = usersData.findById(req.user.id);
  // Token válido pero el usuario ya no existe (los datos viven en memoria y se pierden al reiniciar)
  if (!user) return next(new AppError('Token inválido o expirado', 401));
  res.json(usersData.toSafeUser(user));
};

module.exports = { register, login, me };