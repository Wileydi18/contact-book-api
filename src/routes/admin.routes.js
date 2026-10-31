const { Router } = require('express');
const verifyToken = require('../middlewares/verifyToken');
const checkRole = require('../middlewares/checkRole');
const controller = require('../controllers/admin.controller');

const router = Router();

// Protege TODAS las rutas de este router: cada ruta nueva que agregues aqui estara automaticamente protegida
router.use(verifyToken, checkRole('admin'));

router.get('/users', controller.listUsers);
router.patch('/users/:id/role', controller.updateRole);

module.exports = router;