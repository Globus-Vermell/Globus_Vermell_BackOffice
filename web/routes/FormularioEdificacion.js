import express from "express";
import supabase from "../config.js";

const router = express.Router();

router.get("/", (req, res) => {
    res.render("FormularioEdificacion");
});

router.post("/", async (req, res) => {
    const { nom, adreca, any_construccio, publicacio_id, arquitectes, tipologia } = req.body;

    try {
        const { error } = await supabase
            .from("buildings")
            .insert([{ nom, adreca, any_construccio, publicacio_id, arquitectes, tipologia }]);

        if (error) {
            console.error("Error al guardar:", error);
            return res.status(400).json({ success: false, message: "Error al guardar la edificación" });
        }

        res.json({ success: true, message: "Edificació guardada correctament!" });
    } catch (err) {
        console.error("Error:", err);
        res.status(500).json({ success: false, message: "Error interno del servidor" });
    }
});

export default router;