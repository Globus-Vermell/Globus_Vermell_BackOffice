import express from "express";
import supabase from "../config.js";

const router = express.Router();

router.get("/", (req, res) => {
    if (req.session?.user) {
        return res.redirect("/home");
    }
    res.render("login", { error: "" });
});

router.post("/", async (req, res) => {
    const { username, password } = req.body;

    if (!username || !password) {
        return res.render("login", { error: "Debes introducir usuario y contraseña." });
    }

    try {
        const { data: user } = await supabase
            .from("users")
            .select("*")
            .eq("name", username)
            .eq("password", password)
            .maybeSingle();

        if (!user) {
            return res.render("login", { error: "Usuario o contraseña incorrectos." });
        }

        req.session.user = {
            id: user.id_user,
            name: user.name,
            email: user.email,
            level: user.level
        };

        res.redirect("/home");
    } catch (err) {
        console.error(err);
        res.status(500).send("Error interno del servidor");
    }
});

router.get("/logout", (req, res) => {
    req.session.destroy(err => {
        if (err) {
            console.error("Error al cerrar sesión:", err);
            return res.status(500).send("Error al tancar sessió");
        }
        res.redirect("/");
    });
});

export default router;