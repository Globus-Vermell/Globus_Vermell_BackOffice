import express from "express";
import supabase from "../../config.js";

const router = express.Router();

router.get("/", async (req, res) => {
    const { data: reformas, error } = await supabase
        .from("reform")
        .select("*");

    if (error) {
        console.error("Error al obtener reformas:", error);
        return res.status(500).send("Error al obtener reformas");
    }

    res.render("reform/reform", { reformas });
});

router.delete("/delete/:id", async (req, res) => {
    const id = Number(req.params.id);

    const { error } = await supabase
        .from("reform")
        .delete()
        .eq("id_reform", id);

    if (error) {
        console.error("Error borrando:", error);
        return res.status(500).json({ success: false, message: "Error al borrar." });
    }

    return res.json({ success: true, message: "Reforma eliminada correctament!" });
});

export default router;