const { Router } = require('express');
const controller = require('../controllers/auth.controller');
const { registerValidations, loginValidations } = require('../validators/auth.validators');
const verifyToken = require('../middlewares/verifyToken');

const router = Router();

// Publicas
router.post('/register', registerValidations, controller.register);
router.post('/login', loginValidations, controller.login);

// Cualquier usuario autenticado
router.get('/me', verifyToken, controller.me);

module.exports = router;