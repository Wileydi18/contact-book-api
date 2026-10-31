const { validationResult } = require('express-validator');
const contactsData = require('../data/contacts.data');
const AppError = require('../utils/AppError');

// ¿Ya hay OTRO contacto con ese telefono? (exceptId evita chocar con el mismo en PUT)
const phoneInUse = (phone, exceptId) =>
  contactsData.getAll().some((c) => c.phone === phone && c.id !== exceptId);

const getAllContacts = (req, res) => {
  res.json(contactsData.getAll());
};

const getContactById = (req, res, next) => {
  const contact = contactsData.getById(Number(req.params.id));
  if (!contact) return next(new AppError('Contacto no encontrado', 404));
  res.json(contact);
};

const createContact = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return next(new AppError(errors.array()[0].msg, 400));
  }

  const { name, phone, email, category, favorite } = req.body;
  if (phoneInUse(phone)) {
    return next(new AppError('Ya existe un contacto con ese teléfono', 409));
  }

  const newContact = contactsData.create({ name, phone, email, category, favorite });
  res.status(201).json(newContact);
};

const updateContact = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return next(new AppError(errors.array()[0].msg, 400));
  }

  const id = Number(req.params.id);
  if (!contactsData.getById(id)) {
    return next(new AppError('Contacto no encontrado', 404));
  }

  const { name, phone, email, category, favorite } = req.body;
  if (phoneInUse(phone, id)) {
    return next(new AppError('Ya existe un contacto con ese teléfono', 409));
  }

  // PUT reemplaza: lo que no se envía vuelve a su valor por defecto
  const contact = contactsData.update(id, {
    name,
    phone,
    email,
    category: category || 'other',
    favorite: favorite || false,
  });
  res.json(contact);
};

const toggleFavorite = (req, res, next) => {
  const id = Number(req.params.id);
  const contact = contactsData.getById(id);
  if (!contact) return next(new AppError('Contacto no encontrado', 404));

  res.json(contactsData.update(id, { favorite: !contact.favorite }));
};

const deleteContact = (req, res, next) => {
  const deleted = contactsData.remove(Number(req.params.id));
  if (!deleted) return next(new AppError('Contacto no encontrado', 404));
  res.status(204).send();
};

const getStats = (req, res) => {
  const contacts = contactsData.getAll();
  const byCategory = { family: 0, friends: 0, work: 0, other: 0 };
  contacts.forEach((c) => byCategory[c.category]++);

  res.json({
    clientId: req.clientId,
    total: contacts.length,
    favorites: contacts.filter((c) => c.favorite).length,
    byCategory,
  });
};

module.exports = {
  getAllContacts,
  getContactById,
  createContact,
  updateContact,
  toggleFavorite,
  deleteContact,
  getStats,
};