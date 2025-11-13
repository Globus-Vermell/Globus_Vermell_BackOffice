import express from "express";
import supabase from "../config.js";

const router = express.Router();

router.get("/", (req, res) => {
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

        req.session.user = { id: user.id_user, username: user.name, email: user.email };

        
    } catch {
        res.status(500).send("Error interno del servidor");
    }
});

router.post("/logout", (req, res) => {
    if (req.session) {
        req.session.destroy(() => res.redirect("/"));
    } else {
        res.redirect("/");
    }
});

export default router;