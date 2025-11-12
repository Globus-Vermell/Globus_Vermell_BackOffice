import express from 'express';
import publicacionesRouter from './routes/publicaciones.js';
import arquitectosRouter from './routes/arquitectos.js';
import reformasRouter from "./routes/reformas.js";
import premiosRouter from "./routes/premios.js";
import nomenclaturaRouter from "./routes/nomenclatura.js";
import tipologiaRouter from "./routes/tipologia.js";
import proteccionRouter from "./routes/proteccion.js";
import construccionesRouter from "./routes/construcciones.js";
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

app.use("/login", (req, res) => {
  res.render("login");
});


app.use('/publicaciones', publicacionesRouter);
app.use("/arquitectos", arquitectosRouter);
app.use("/reformas", reformasRouter);
app.use("/premios", premiosRouter);
app.use("/construcciones", construccionesRouter);
app.use("/nomenclatura", nomenclaturaRouter);
app.use("/tipologia", tipologiaRouter);
app.use("/proteccion", proteccionRouter);






// Start
app.listen(PORT, () => {
  console.log(`Server running on port${PORT}`);
});