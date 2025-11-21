import express from "express";
import supabase from "../../config.js";

const router = express.Router();

router.get("/", (req, res) => {
    res.render("architects/architectsForm");
});

router.post("/", async (req, res) => {
    const { name, description, birth_year, death_year, nationality } = req.body;

    if (!name) {
        return res.status(400).json({ success: false, message: "El nom és obligatori" });
    }

    try {
        const { error } = await supabase
            .from("architects")
            .insert([
                {
                    name,
                    description,
                    birth_year: birth_year || null,
                    death_year: death_year || null,
                    nationality: nationality || null
                }
            ]);

        if (error) {
            console.error("Error al guardar arquitecto", error);
            return res.status(400).json({ success: false, message: "Error al guardar el arquitecto" });
        }

        return res.json({ success: true, message: "Arquitecto guardado correctamente!" });
    } catch (err) {
        console.error("Error:", err);
        return res.status(500).json({ success: false, message: "Error intern del servidor" });
    }
});

export default router;