import express from 'express';
import publicacionesRouter from './routes/publicaciones.js';
import arquitectosRouter from './routes/arquitectos.js';
const PORT = process.env.PORT || 3000;

const app = express();
app.use(express.json());
app.use(express.static('public'));
app.set('views', './views');
app.set('view engine', 'ejs');

// Home provicional para facilitar l navegacion a la hora de trabajar
app.get("/", (req, res) => {
  res.render("home");
});
app.use('/publicaciones', publicacionesRouter);
app.use("/arquitectos", arquitectosRouter);


// Start
app.listen(PORT, () => {
  console.log(`Server running on port${PORT}`);
});