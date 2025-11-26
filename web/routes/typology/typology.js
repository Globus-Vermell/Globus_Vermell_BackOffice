import express from "express";
import supabase from "../../config.js";


// Constante y configuración del srvidor Express
const router = express.Router();

// Ruta para obtener todas las tipologías
router.get("/", async (req, res) => {
    const { data: typologies, error } = await supabase
        .from("typology")
        .select("*")
        .order("name");

    if (error) {
        console.error("Error al obtener tipologías:", error);
        return res.status(500).send("Error al obtener tipologías");
    }

    res.render("typology/typology", { typologies });
});

// Ruta para eliminar una tipología
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

// Exportar el router para usarlo en index.js
export default router;