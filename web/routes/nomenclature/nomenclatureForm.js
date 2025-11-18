import express from "express";
import supabase from "../../config.js";

const router = express.Router();

router.get("/", (req, res) => {
    res.render("nomenclature/nomenclatureForm");
});

router.post("/", async (req, res) => {
    const { name, description } = req.body;

    if (!name) {
        return res.status(400).json({ success: false, message: "El nom és obligatori" });
    }

    try {
        const { error } = await supabase
            .from("nomenclature")
            .insert([
                {
                    name,
                    description: description
                }
            ]);

        if (error) {
            console.error("Error al guardar nomenclatura:", error);
            return res.status(400).json({ success: false, message: "Error al guardar la nomenclatura" });
        }

        return res.json({ success: true, message: "Nomenclatura guardada correctamente!" });
    } catch (err) {
        console.error("Error:", err);
        return res.status(500).json({ success: false, message: "Error interno del servidor" });
    }
});

export default router;