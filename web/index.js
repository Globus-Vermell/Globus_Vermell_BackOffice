import express from 'express';
import session from "express-session";
import publicacionesRouter from './routes/publicaciones.js';
import arquitectosRouter from './routes/arquitectos.js';
import reformasRouter from "./routes/reformas.js";
import premiosRouter from "./routes/premios.js";
import nomenclaturaRouter from "./routes/nomenclatura.js";
import tipologiaRouter from "./routes/tipologia.js";
import proteccionRouter from "./routes/proteccion.js";
import construccionesRouter from "./routes/construcciones.js";
import loginRouter from "./routes/login.js";
import FormularioEdificacionRouter from "./routes/FormularioEdificacion.js";
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


app.use('/publicaciones', publicacionesRouter);
app.use("/arquitectos", arquitectosRouter);
app.use("/reformas", reformasRouter);
app.use("/premios", premiosRouter);
app.use("/construcciones", construccionesRouter);
app.use("/nomenclatura", nomenclaturaRouter);
app.use("/tipologia", tipologiaRouter);
app.use("/proteccion", proteccionRouter);
app.use("/construcciones", construccionesRouter);
app.use("/FormularioEdificacion", FormularioEdificacionRouter);
app.use("/", loginRouter);



// Start
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});