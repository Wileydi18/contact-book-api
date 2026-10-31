const jwt = require('jsonwebtoken');

// Firma el token con el id (sub) y el rol. Nada más va en el payload:
// el payload se puede leer en jwt.io, así que nunca datos sensibles. CUIDADO CON LO QE PONGO AQUI
const signToken = (user) =>
  jwt.sign(
    { sub: user.id, role: user.role }, // payload
    process.env.JWT_SECRET, // firma
    { expiresIn: process.env.JWT_EXPIRES_IN || '1h' }
  );

module.exports = { signToken };