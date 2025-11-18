import express from "express";
import supabase from "../../config.js";

const router = express.Router();

router.get("/", (req, res) => {
    res.render("publications/publicationsForm");
});

router.post("/", async (req, res) => {
    const { title, description, themes, acknowledgment, publication_edition } = req.body;

    if (!title || !themes || !publication_edition) {
        return res.status(400).json({
            success: false,
            message: "Els camps title, themes i publication_edition són obligatoris."
        });
    }

    try {
        const { error } = await supabase
            .from("publications")
            .insert([
                {
                    title,
                    description: description || null,
                    themes,
                    acknowledgment: acknowledgment || null,
                    publication_edition
                }
            ]);

        if (error) {
            console.error("Error al guardar publicació:", error);
            return res.status(400).json({ success: false, message: "Error al guardar la publicació" });
        }

        return res.json({ success: true, message: "Publicació guardada correctament!" });
    } catch (err) {
        console.error("Error:", err);
        return res.status(500).json({ success: false, message: "Error intern del servidor" });
    }
});

export default router;