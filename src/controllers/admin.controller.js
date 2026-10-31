const usersData = require('../data/users.data');
const AppError = require('../utils/AppError');

const ROLES = ['member', 'manager', 'admin'];

// GET /admin/users: solo admin (protegido en admin.routes.js)
const listUsers = (req, res) => {
  res.json(usersData.findAll());
};

// PATCH /admin/users/:id/role
const updateRole = (req, res, next) => {
  const { role } = req.body;
  if (!ROLES.includes(role)) {
    return next(new AppError(`Rol inválido. Debe ser uno de: ${ROLES.join(', ')}`, 400));
  }

  const user = usersData.findById(Number(req.params.id));
  if (!user) return next(new AppError('Usuario no encontrado', 404));

  user.role = role;
  res.json(usersData.toSafeUser(user));
};

module.exports = { listUsers, updateRole };