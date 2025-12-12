import express from "express";
import { UserModel } from "../models/UserModel.js";

// Constante y configuración del srvidor Express
const router = express.Router();

// Ruta para mostrar el formulario de login
router.get("/", (req, res) => {
    if (req.session?.user) {
        // Si el usuario está autenticado, redirigimos a la página de inicio
        return res.redirect("/home");
    }
    // Si el usuario no está autenticado, mostramos el formulario de login
    res.render("login", { error: "" });
});

// Ruta para procesar el formulario de login
router.post("/", async (req, res) => {
    // Obtenemos los datos del formulario
    const { username, password } = req.body;

    // Validamos que los campos obligatorios no estén vacíos
    if (!username || !password) {
        return res.render("login", { error: "Has d'introduir usuari i contrasenya." });
    }

    try {
        // Buscamos el usuario por su nombre y contraseña
        const user = await UserModel.login(username, password);

        // Si el usuario no existe, mostramos el formulario de login con un mensaje de error
        if (!user) {
            return res.render("login", { error: "Usuari o contrasenya incorrectes." });
        }

        // Si el usuario existe, guardamos su información en la sesión y redirigimos a la página de inicio
        req.session.user = {
            id: user.id_user,
            name: user.name,
            email: user.email,
            level: user.level
        };
        res.redirect("/home");
    } catch (err) {
        console.error(err);
        res.status(500).send("Error intern del servidor");
    }
});

// Ruta para cerrar sesión
router.get("/logout", (req, res) => {
    req.session.destroy(err => {
        if (err) {
            console.error("Error al tancar sessió:", err);
            return res.status(500).send("Error al tancar sessió");
        }
        res.redirect("/");
    });
});

// Exportar el router para usarlo en index.js
export default router;