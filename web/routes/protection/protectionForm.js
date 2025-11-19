import express from "express";
import supabase from "../../config.js";

const router = express.Router();

router.get("/", (req, res) => {
    res.render("protection/protectionForm");
});

router.post("/", async (req, res) => {
    const { level, description } = req.body;

    if (!level) {
        return res.status(400).json({ success: false, message: "El nivell és obligatori" });
    }

    try {
        const { error } = await supabase
            .from("protection")
            .insert([
                {
                    level,
                    description: description
                }
            ]);

        if (error) {
            console.error("Error al guardar protecció:", error);
            return res.status(400).json({ success: false, message: "Error al guardar la protecció" });
        }

        return res.json({ success: true, message: "Protecció guardada correctament!" });
    } catch (err) {
        console.error("Error:", err);
        return res.status(500).json({ success: false, message: "Error intern del servidor" });
    }
});

export default router;