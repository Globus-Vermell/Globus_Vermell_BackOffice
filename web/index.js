import express from 'express';
import publicacionesRouter from './routes/publicaciones.js';
const PORT = process.env.PORT || 3000;

const app = express();
app.use(express.json());
app.use(express.static('public'));
app.set('views', './views');
app.set('view engine', 'ejs');

// Rutas
app.use('/', publicacionesRouter);

// Start
app.listen(PORT, () => {
  console.log(`Server running on${PORT}`);
});