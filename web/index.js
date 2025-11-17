import express from 'express';
import session from "express-session";
import publicacionesRouter from './routes/publications.js';
import arquitectosRouter from './routes/architects.js';
import reformasRouter from "./routes/reform.js";
import premiosRouter from "./routes/prizes.js";
import nomenclaturaRouter from "./routes/nomenclature.js";
import tipologiaRouter from "./routes/typology.js";
import proteccionRouter from "./routes/protection.js";
import construccionesRouter from "./routes/buildings.js";
import loginRouter from "./routes/login.js";
import FormularioEdificacionRouter from "./routes/buildingsForm.js";
const PORT = process.env.PORT || 3000;

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));
app.set('views', './views');
app.set('view engine', 'ejs');

app.use(session({
  secret: 'secretosecreto',
  resave: false,
  saveUninitialized: true,
  cookie: { secure: false }
}));

app.get("/home", (req, res) => {
  res.render("home", { user: req.session?.user });
});

app.use("/architects", arquitectosRouter);
app.use("/buildings", construccionesRouter);
app.use("/buildings/form", FormularioEdificacionRouter);
app.use("/", loginRouter);
app.use("/nomenclature", nomenclaturaRouter);
app.use("/prizes", premiosRouter);
app.use("/protection", proteccionRouter);
app.use('/publications', publicacionesRouter);
app.use("/reform", reformasRouter);
app.use("/typology", tipologiaRouter);


// Start
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});