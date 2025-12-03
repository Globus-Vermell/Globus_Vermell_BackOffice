import express from 'express';
import session from "express-session";
import publicacionesRouter from './routes/publications/publications.js';
import prizesRouter from "./routes/prizes.js";
import tipologiaRouter from "./routes/typology/typology.js";
import construccionesRouter from "./routes/buildings/buildings.js";
import loginRouter from "./routes/login.js";
import FormularioEdificacionRouter from "./routes/buildings/buildingsForm.js";
import tipologiaFormRouter from "./routes/typology/typologyForm.js";
import publicacionesFormRouter from "./routes/publications/publicationsForm.js";
import buildingsEditRouter from "./routes/buildings/buildingsEdit.js";
import publicationsEditRouter from "./routes/publications/publicationsEdit.js";
import typologyEditRouter from "./routes/typology/typologyEdit.js";
import usersRouter from "./routes/users/users.js";
import usersFormRouter from "./routes/users/usersForm.js";
import usersEditRouter from "./routes/users/usersEdit.js";
import architectsRouter from "./routes/architects.js";
import protectionsRouter from "./routes/protections.js";
import reformsRouter from "./routes/reforms.js";

// Constante y configuración del srvidor Express
const PORT = process.env.PORT || 3000;
const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));
app.set('views', './views');
app.set('view engine', 'ejs');


// Configuración de la sesión para la autenticación
app.use(session({
    secret: 'secretosecreto',
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false }
}));

// Middleware para pasar el usuario a las vistas y poder controlar el acceso a ciertas páginas
app.use((req, res, next) => {
    res.locals.user = req.session.user;
    next();
});

// Ruta de inicio 
app.get("/home", (req, res) => {
    res.render("home", { user: req.session?.user });
});

// Ruters del backOffice
app.use("/architects", architectsRouter);
app.use("/buildings", construccionesRouter);
app.use("/buildings/form", FormularioEdificacionRouter);
app.use("/buildings/edit", buildingsEditRouter);
app.use("/", loginRouter);
app.use("/prizes", prizesRouter);
app.use("/protection", protectionsRouter);
app.use('/publications', publicacionesRouter);
app.use("/publications/form", publicacionesFormRouter);
app.use("/publications/edit", publicationsEditRouter);
app.use("/reforms", reformsRouter);
app.use("/typology", tipologiaRouter);
app.use("/typology/form", tipologiaFormRouter);
app.use("/typology/edit", typologyEditRouter);
app.use("/users", usersRouter);
app.use("/users/edit", usersEditRouter);
app.use("/users/form", usersFormRouter);


// Start
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});