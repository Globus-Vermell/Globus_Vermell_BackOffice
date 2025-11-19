import express from "express";
import supabase from "../../config.js";

const router = express.Router();

router.get("/", async (req, res) => {
    const { data: typologies, error } = await supabase
        .from("typology")
        .select("*");

    if (error) {
        console.error("Error al obtener tipologías:", error);
        return res.status(500).send("Error al obtener tipologías");
    }

    res.render("typology/typology", { typologies });
});

router.delete("/delete/:id", async (req, res) => {
    const id = Number(req.params.id);

    const { error } = await supabase
        .from("typology")
        .delete()
        .eq("id_typology", id);

    if (error) {
        console.error("Error borrando:", error);
        return res.status(500).json({ success: false, message: "Error al borrar." });
    }

    return res.json({ success: true, message: "Tipología eliminada correctament!" });
});

export default router;