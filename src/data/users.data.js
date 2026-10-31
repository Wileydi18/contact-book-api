const bcrypt = require('bcryptjs');

// Capa de datos en memoria para usuarios (misma idea que contacts.data.js).
let users = [];
let nextId = 1;

// Nunca exponemos passwordHash hacia afuera
const toSafeUser = ({ passwordHash, ...safe }) => safe;

const findByEmail = (email) => users.find((u) => u.email === email);

const findById = (id) => users.find((u) => u.id === id);

const findAll = () => users.map(toSafeUser);

const create = ({ name, email, passwordHash, role = 'member' }) => {
  const newUser = {
    id: nextId++,
    name,
    email,
    passwordHash,
    role,
    createdAt: new Date().toISOString(),
  };
  users.push(newUser);
  return newUser;
};

// Siembra el admin desde .env (sin contraseñas en el código). CUIDADO CON ESTO
// Es la única forma de que exista el primer admin: /auth/register solo crea members.
const seedAdmin = () => {
  const { ADMIN_EMAIL, ADMIN_PASSWORD } = process.env;
  if (!ADMIN_EMAIL || !ADMIN_PASSWORD) {
    console.warn('[seed] Falta ADMIN_EMAIL o ADMIN_PASSWORD en .env: no se creó el admin');
    return;
  }

  const email = ADMIN_EMAIL.toLowerCase();
  if (findByEmail(email)) return; // ya existe: no lo duplicamos

  create({
    name: 'Aura',
    email,
    passwordHash: bcrypt.hashSync(ADMIN_PASSWORD, 10),
    role: 'admin',
  });
};

module.exports = { findByEmail, findById, findAll, create, seedAdmin, toSafeUser };