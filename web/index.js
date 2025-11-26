import express from 'express';
import session from "express-session";
import publicacionesRouter from './routes/publications/publications.js';
import arquitectosRouter from './routes/architects/architects.js';
import reformasRouter from "./routes/reform/reform.js";
import premiosRouter from "./routes/prizes/prizes.js";
import tipologiaRouter from "./routes/typology/typology.js";
import proteccionRouter from "./routes/protection/protection.js";
import construccionesRouter from "./routes/buildings/buildings.js";
import loginRouter from "./routes/login.js";
import FormularioEdificacionRouter from "./routes/buildings/buildingsForm.js";
import architectsFormRouter from "./routes/architects/architectsForm.js";
import prizesFormRouter from "./routes/prizes/prizesForm.js";
import proteccionFormRouter from "./routes/protection/protectionForm.js";
import reformasFormRouter from "./routes/reform/reformForm.js";
import tipologiaFormRouter from "./routes/typology/typologyForm.js";
import publicacionesFormRouter from "./routes/publications/publicationsForm.js";
import architectsEditRouter from "./routes/architects/architectsEdit.js";
import buildingsEditRouter from "./routes/buildings/buildingsEdit.js";
import prizesEditRouter from "./routes/prizes/prizesEdit.js";
import protectionEditRouter from "./routes/protection/protectionEdit.js";
import publicationsEditRouter from "./routes/publications/publicationsEdit.js";
import reformEditRouter from "./routes/reform/reformEdit.js";
import typologyEditRouter from "./routes/typology/typologyEdit.js";
import usersRouter from "./routes/users/users.js";
import usersFormRouter from "./routes/users/usersForm.js";
import usersEditRouter from "./routes/users/usersEdit.js";

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

// Ruters de el backOffice
app.use("/architects", arquitectosRouter);
app.use("/architects/form", architectsFormRouter);
app.use("/architects/edit", architectsEditRouter);
app.use("/buildings", construccionesRouter);
app.use("/buildings/form", FormularioEdificacionRouter);
app.use("/buildings/edit", buildingsEditRouter);
app.use("/", loginRouter);
app.use("/prizes", premiosRouter);
app.use("/prizes/form", prizesFormRouter);
app.use("/prizes/edit", prizesEditRouter);
app.use("/protection", proteccionRouter);
app.use("/protection/form", proteccionFormRouter);
app.use("/protection/edit", protectionEditRouter);
app.use('/publications', publicacionesRouter);
app.use("/publications/form", publicacionesFormRouter);
app.use("/publications/edit", publicationsEditRouter);
app.use("/reform", reformasRouter);
app.use("/reform/form", reformasFormRouter);
app.use("/reform/edit", reformEditRouter);
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