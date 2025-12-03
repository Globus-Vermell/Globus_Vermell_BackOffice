import express from 'express';
import session from "express-session";
import dotenv from 'dotenv';


import loginRouter from "./routes/login.js";
import usersRouter from "./routes/users.js";
import architectsRouter from "./routes/architects.js";
import buildingsRouter from "./routes/buildings.js";
import prizesRouter from "./routes/prizes.js";
import protectionsRouter from "./routes/protections.js";
import publicationsRouter from "./routes/publications.js";
import reformsRouter from "./routes/reforms.js";
import typologiesRouter from "./routes/typologies.js";

dotenv.config();

const PORT = process.env.PORT || 3000;
const app = express();



app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));
app.set('views', './views');
app.set('view engine', 'ejs');

// Configuración de la sesión 
app.use(session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false }
}));

// Middleware para pasar el usuario a las vistas
app.use((req, res, next) => {
    res.locals.user = req.session.user;
    next();
});

// Ruta de inicio 
app.get("/home", (req, res) => {
    res.render("home", { user: req.session?.user });
});

app.use("/", loginRouter);
app.use("/users", usersRouter);
app.use("/architects", architectsRouter);
app.use("/buildings", buildingsRouter);
app.use("/prizes", prizesRouter);
app.use("/protection", protectionsRouter);
app.use('/publications', publicationsRouter);
app.use("/reforms", reformsRouter);
app.use("/typologies", typologiesRouter);

// Start
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});