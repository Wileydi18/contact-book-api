// Capa de datos en memoria. 
// (getAll, getById, create, update, remove).

let contacts = [
  {
    id: 1,
    name: 'Ana Pérez',
    phone: '+1 809-555-0101',
    email: 'ana@correo.com',
    category: 'family',
    favorite: true,
    createdAt: new Date().toISOString(),
  },
  {
    id: 2,
    name: 'Luis Gómez',
    phone: '809-555-0102',
    email: 'luis@correo.com',
    category: 'friends',
    favorite: false,
    createdAt: new Date().toISOString(),
  },
  {
    id: 3,
    name: 'Marta Díaz',
    phone: '(809) 555-0103',
    category: 'work',
    favorite: false,
    createdAt: new Date().toISOString(),
  },
];
let nextId = 4;

const getAll = () => contacts;

const getById = (id) => contacts.find((c) => c.id === id);

const create = ({ name, phone, email, category, favorite }) => {
  const newContact = {
    id: nextId++,
    name,
    phone,
    email,
    category: category || 'other',
    favorite: favorite || false,
    createdAt: new Date().toISOString(),
  };
  contacts.push(newContact);
  return newContact;
};

// Object.assign cambia solo los campos recibidos; id y createdAt no se tocan
const update = (id, changes) => {
  const contact = getById(id);
  if (!contact) return null;
  Object.assign(contact, changes);
  return contact;
};

const remove = (id) => {
  const index = contacts.findIndex((c) => c.id === id);
  if (index === -1) return false;
  contacts.splice(index, 1);
  return true;
};

module.exports = { getAll, getById, create, update, remove };
