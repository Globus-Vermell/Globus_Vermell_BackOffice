import express from "express";
import supabase from "../../config.js";

const router = express.Router();

router.get("/", (req, res) => {
    res.render("prizes/prizesForm");
});

router.post("/", async (req, res) => {
    const { name, tipe, year, description } = req.body;

    if (!name) {
        return res.status(400).json({ success: false, message: "El nom és obligatori" });
    }

    try {
        const { error } = await supabase
            .from("prizes")
            .insert([
                {
                    name,
                    tipe: tipe,
                    year: parseInt(year),
                    description: description
                }
            ]);

        if (error) {
            console.error("Error al guardar premi:", error);
            return res.status(400).json({ success: false, message: "Error al guardar el premi" });
        }

        return res.json({ success: true, message: "Premi guardat correctament!" });
    } catch (err) {
        console.error("Error:", err);
        return res.status(500).json({ success: false, message: "Error intern del servidor" });
    }
});

export default router;