import express from "express";
import supabase from "../../config.js";

const router = express.Router();

router.get("/", (req, res) => {
    res.render("reform/reformForm");
});

router.get("/architects", async (req, res) => {
    const { data, error } = await supabase
        .from("architects")
        .select("id_architect, name");

    if (error) return res.status(500).json([]);
    res.json(data || []);
});

router.post("/", async (req, res) => {
    const { year, id_architect } = req.body;

    if (!id_architect) {
        return res.status(400).json({ success: false, message: "L'arquitecte és obligatori" });
    }

    try {
        const { error } = await supabase
            .from("reform")
            .insert([
                {
                    year: parseInt(year),
                    id_architect: parseInt(id_architect)
                }
            ]);

        if (error) {
            console.error("Error al guardar reforma:", error);
            return res.status(400).json({ success: false, message: "Error al guardar la reforma" });
        }

        return res.json({ success: true, message: "Reforma guardada correctament!" });
    } catch (err) {
        console.error("Error:", err);
        return res.status(500).json({ success: false, message: "Error intern del servidor" });
    }
});

export default router;