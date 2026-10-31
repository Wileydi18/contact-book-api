const { body } = require('express-validator');

// Si hay varios errores, el controlador responde con el primero
const registerValidations = [
  body('name')
    .trim()
    .isLength({ min: 2, max: 50 })
    .withMessage('El nombre es obligatorio y debe tener entre 2 y 50 caracteres'),
  body('email').trim().toLowerCase().isEmail().withMessage('El correo no es válido'),
  body('password')
    .isString()
    .withMessage('La contraseña debe tener al menos 6 caracteres')
    .isLength({ min: 6 })
    .withMessage('La contraseña debe tener al menos 6 caracteres'),
];

const loginValidations = [
  body('email').trim().toLowerCase().isEmail().withMessage('El correo no es válido'),
  body('password')
    .isString()
    .withMessage('La contraseña es obligatoria')
    .notEmpty()
    .withMessage('La contraseña es obligatoria'),
];

module.exports = { registerValidations, loginValidations };
