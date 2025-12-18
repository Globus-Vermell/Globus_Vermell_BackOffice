import express from 'express';
import session from "express-session";
import dotenv from 'dotenv';
import pgSession from 'connect-pg-simple';
import pg from 'pg';
import { errorHandler } from './middlewares/error.js';
import loginRouter from "./routes/auth.js";
import usersRouter from "./routes/users.js";
import architectsRouter from "./routes/architects.js";
import buildingsRouter from "./routes/buildings.js";
import prizesRouter from "./routes/prizes.js";
import protectionsRouter from "./routes/protections.js";
import publicationsRouter from "./routes/publications.js";
import reformsRouter from "./routes/reforms.js";
import typologiesRouter from "./routes/typologies.js";

dotenv.config();
const PORT = 3000;

const PgSession = pgSession(session);
const pgPool = new pg.Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: { rejectUnauthorized: false }
});
const app = express();

app.set('trust proxy', 1);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));
app.set('views', './views');
app.set('view engine', 'ejs');

// Configuración de la sesión 
app.use(session({
    store: new PgSession({
        pool: pgPool,
        tableName: 'session',
        createTableIfMissing: true
    }),
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: {
        secure: process.env.NODE_ENV === 'production',
        maxAge: 30 * 24 * 60 * 60 * 1000,
        httpOnly: true
    }
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

// Rutas
app.use("/", loginRouter);
app.use("/users", usersRouter);
app.use("/architects", architectsRouter);
app.use("/buildings", buildingsRouter);
app.use("/prizes", prizesRouter);
app.use("/protections", protectionsRouter);
app.use('/publications', publicationsRouter);
app.use("/reforms", reformsRouter);
app.use("/typologies", typologiesRouter);

// Controllador de errores
app.use(errorHandler);

// Start
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});