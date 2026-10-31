require('dotenv').config(); // SIEMPRE la primera línea. MANTEN ESTE ORDEN
const app = require('./app');
const { seedAdmin } = require('./data/users.data');

const PORT = process.env.PORT || 3000;

// Los datos viven en memoria: el admin se vuelve a sembrar en cada reinicio
seedAdmin(); // antes de app.listen

app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});