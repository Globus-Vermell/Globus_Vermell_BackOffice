import express from "express";
import supabase from "../../config.js";
const router = express.Router();


router.get("/", async (req, res) => {
    const { data: buildings, error } = await supabase
        .from("buildings")
        .select("*");

    if (error) {
        console.error("Error al obtener las construcciones:", error);
        return res.status(500).send("Error al obtener construcciones");
    }
    res.render("buildings/buildings", { buildings });
});

router.delete("/delete/:id", async (req, res) => {
    const id = Number(req.params.id);

    const { error } = await supabase
        .from("buildings")
        .delete()
        .eq("id_building", id);

    if (error) {
        console.error("Error borrando:", error);
        return res.status(500).json({ success: false, message: "Error al borrar." });
    }

    return res.json({ success: true, message: "Edificació eliminada correctament!" });
});

export default router;