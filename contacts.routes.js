const { Router } = require('express');
const controller = require('../controllers/contacts.controller');
const { contactValidations } = require('../validators/contacts.validators');
const requireClientId = require('../middlewares/requireClientId');
const validateApiKey = require('../middlewares/validateApiKey');

const router = Router();

router.get('/', controller.getAllContacts);
// ANTES de '/:id' para que "stats" no se confunda con un id
router.get('/stats/summary', requireClientId, controller.getStats);
router.get('/:id', controller.getContactById);
router.post('/', contactValidations, controller.createContact);
router.put('/:id', contactValidations, controller.updateContact);
router.patch('/:id/favorite', controller.toggleFavorite);
router.delete('/:id', validateApiKey, controller.deleteContact);

module.exports = router;
