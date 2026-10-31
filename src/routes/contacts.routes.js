const { Router } = require('express');
const controller = require('../controllers/contacts.controller');
const { contactValidations } = require('../validators/contacts.validators');
const requireClientId = require('../middlewares/requireClientId');
const verifyToken = require('../middlewares/verifyToken');
const checkRole = require('../middlewares/checkRole');

const router = Router();

// Una agenda tiene datos personales: NINGUNA ruta de contactos es pública. OJO TENER ESTO MUY EN CUENTA
// verifyToken corre primero en todas (crea req.user); después cada ruta decide el rol. TENER EN CUENTA EL ORDEN
router.use(verifyToken);

// member, manager y admin
router.get('/', controller.getAllContacts);
// ANTES de '/:id' para que "stats" no se confunda con un id. EL ORDEN DE LOS FACTORES PUEDE ALTERAR EL PRODUCTO
router.get('/stats/summary', requireClientId, controller.getStats);
router.get('/:id', controller.getContactById);
router.post('/', contactValidations, controller.createContact);
router.put('/:id', contactValidations, controller.updateContact);
router.patch('/:id/favorite', controller.toggleFavorite);

// Solo manager y admin: el member recibe 403
router.delete('/:id', checkRole('manager', 'admin'), controller.deleteContact);

module.exports = router;