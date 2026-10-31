const { body } = require('express-validator');

const VALID_CATEGORIES = ['family', 'friends', 'work', 'other'];

// Si hay varios errores, el controlador responde con el primero
const contactValidations = [
  body('name')
    .trim()
    .isLength({ min: 2, max: 50 })
    .withMessage('El nombre es obligatorio y debe tener entre 2 y 50 caracteres'),
  body('phone')
    .trim()
    .matches(/^[0-9\s\-()+]+$/)
    .withMessage('El telefono solo puede tener digitos, espacios, guiones, parentesis y +')
    .isLength({ min: 7, max: 20 })
    .withMessage('El telefono debe tener entre 7 y 20 caracteres'),
  body('email').optional().isEmail().withMessage('El email no es valido'),
  body('category')
    .optional()
    .isIn(VALID_CATEGORIES)
    .withMessage(`La categoria debe ser una de: ${VALID_CATEGORIES.join(', ')}`),
  body('favorite')
    .optional()
    .isBoolean({ strict: true })
    .withMessage('favorite debe ser true o false'),
];

module.exports = { contactValidations };
