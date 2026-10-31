const express = require('express');
const helmet = require('helmet');
const cors = require('cors');
const morgan = require('morgan');
const rateLimit = require('express-rate-limit');
const contactsRoutes = require('./routes/contacts.routes');
const requestTimer = require('./middlewares/requestTimer');
const notFound = require('./middlewares/notFound');
const errorHandler = require('./middlewares/errorHandler');

const app = express();

const limiter = rateLimit({
  windowMs: 10 * 60 * 1000, // ventana de 10 minutos
  limit: 50, // max. por IP
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: 'Demasiadas peticiones, intenta más tarde' },
});

// Middlewares de aplicación (el orden importa)
app.use(helmet());
app.use(cors({ origin: 'http://localhost:5173' }));
app.use(morgan('dev'));
app.use(express.json()); // antes de las rutas, si no req.body llega undefined
app.use(requestTimer);

// El limiter ANTES de las rutas
app.use('/contacts', limiter);
app.use('/contacts', contactsRoutes);

// Estos dos van SIEMPRE al final, en este orden:
app.use(notFound);
app.use(errorHandler);

module.exports = app;
