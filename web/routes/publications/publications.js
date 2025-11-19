import express from "express";
import supabase from "../../config.js";
const router = express.Router();


router.get("/", async (req, res) => {
    const { data: publications, error } = await supabase
        .from("publications")
        .select("*");

    if (error) {
        console.error("Error al obtener publicaciones:", error);
        return res.status(500).send("Error al obtener publicaciones");
    }
    res.render("publications/publications", { publications });
});

router.delete("/delete/:id", async (req, res) => {
    const id = Number(req.params.id);

    const { error } = await supabase
        .from("publications")
        .delete()
        .eq("id_publication", id);

    if (error) {
        console.error("Error borrando:", error);
        return res.status(500).json({ success: false, message: "Error al borrar." });
    }

    return res.json({ success: true, message: "Publicación eliminada correctament!" });
});

export default router;