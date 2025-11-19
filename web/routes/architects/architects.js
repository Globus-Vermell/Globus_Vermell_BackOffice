import express from "express";
import supabase from "../../config.js";

const router = express.Router();

router.get("/", async (req, res) => {
    const { data: architects, error } = await supabase
        .from("architects")
        .select("*");

    if (error) {
        console.error("Error al obtener arquitectos:", error);
        return res.status(500).send("Error al obtener arquitectos");
    }

    res.render("architects/architects", { architects });
});

router.delete("/delete/:id", async (req, res) => {
    const id = Number(req.params.id);

    const { error } = await supabase
        .from("architects")
        .delete()
        .eq("id_architect", id);

    if (error) {
        console.error("Error borrando:", error);
        return res.status(500).json({ success: false, message: "Error al borrar." });
    }

    return res.json({ success: true, message: "Arquitecto eliminado correctament!" });
});


export default router;