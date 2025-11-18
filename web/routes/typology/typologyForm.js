import express from "express";
import supabase from "../../config.js";

const router = express.Router();

router.get("/", (req, res) => {
    res.render("typology/typologyForm");
});

router.post("/", async (req, res) => {
    const { name, image } = req.body;

    if (!name) {
        return res.status(400).json({ success: false, message: "El nom és obligatori" });
    }

    try {
        const { error } = await supabase
            .from("typology")
            .insert([
                {
                    name,
                    image: image
                }
            ]);

        if (error) {
            console.error("Error al guardar tipologia:", error);
            return res.status(400).json({ success: false, message: "Error al guardar la tipologia" });
        }

        return res.json({ success: true, message: "Tipologia guardada correctament!" });
    } catch (err) {
        console.error("Error:", err);
        return res.status(500).json({ success: false, message: "Error intern del servidor" });
    }
});

export default router;