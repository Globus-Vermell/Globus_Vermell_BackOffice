import express from 'express';
import publicacionesRouter from './routes/publicaciones.js';
import arquitectosRouter from './routes/arquitectos.js';
const PORT = process.env.PORT || 3000;

const app = express();
app.use(express.json());
app.use(express.static('public'));
app.set('views', './views');
app.set('view engine', 'ejs');

// Rutas
app.use('/3233', publicacionesRouter);
app.use("/", arquitectosRouter);

// Start
app.listen(PORT, () => {
  console.log(`Server running on port${PORT}`);
});