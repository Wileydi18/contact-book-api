const express = require('express');
const helmet = require('helmet');
const cors = require('cors');
const morgan = require('morgan');
const rateLimit = require('express-rate-limit');
const contactsRoutes = require('./routes/contacts.routes');
const authRoutes = require('./routes/auth.routes');
const adminRoutes = require('./routes/admin.routes');
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

// Solo para el login: frena la fuerza bruta de contraseñas
const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // ventana de 15 minutos
  limit: 5, // 5 intentos fallidos por IP
  skipSuccessfulRequests: true, // los logins exitosos no cuentan
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: 'Demasiados intentos de inicio de sesión, intenta de nuevo en 15 minutos' },
});

// Middlewares de aplicación (el orden importa). OJO AQUI PARA QUE NO TE VUELVAS LOCA DE NUEVO
app.use(helmet());
app.use(cors({ origin: 'http://localhost:5173' }));
app.use(morgan('dev'));
app.use(express.json()); // antes de las rutas, si no req.body llega undefined. CUIDADO CON EL ORDEN
app.use(requestTimer);

// Rate limiters ANTES de sus rutas
app.use('/contacts', limiter);
app.use('/auth/login', loginLimiter);

// Rutas
app.use('/contacts', contactsRoutes);
app.use('/auth', authRoutes);
app.use('/admin', adminRoutes); // solo admin (ver admin.routes.js)

// CUIDADO CON EL ORDEN DE ESTO. Estos dos van SIEMPRE al final, en este orden:
app.use(notFound);
app.use(errorHandler);

module.exports = app;