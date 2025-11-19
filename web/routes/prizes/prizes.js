import express from "express";
import supabase from "../../config.js";

const router = express.Router();

router.get("/", async (req, res) => {
    const { data: prizes, error } = await supabase
        .from("prizes")
        .select("*");

    if (error) {
        console.error("Error al obtener premios:", error);
        return res.status(500).send("Error al obtener premios");
    }

    res.render("prizes/prizes", { prizes });
});

router.delete("/delete/:id", async (req, res) => {
    const id = Number(req.params.id);

    const { error } = await supabase
        .from("prizes")
        .delete()
        .eq("id_prize", id);

    if (error) {
        console.error("Error borrando:", error);
        return res.status(500).json({ success: false, message: "Error al borrar." });
    }

    return res.json({ success: true, message: "Premi eliminat correctament!" });
});


export default router;