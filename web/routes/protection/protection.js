import express from "express";
import supabase from "../../config.js";


// Constante y configuración del srvidor Express
const router = express.Router();

// Ruta para obtener todas las protecciones
router.get("/", async (req, res) => {
    const { data: protections, error } = await supabase
        .from("protection")
        .select("*")
        .order("name");

    if (error) {
        console.error("Error al obtener protecciones:", error);
        return res.status(500).send("Error al obtener protecciones");
    }

    res.render("protection/protection", { protections });
});

// Ruta para eliminar una protección
router.delete("/delete/:id", async (req, res) => {
    const id = Number(req.params.id);

    const { error } = await supabase
        .from("protection")
        .delete()
        .eq("id_protection", id);

    if (error) {
        console.error("Error borrando:", error);
        return res.status(500).json({ success: false, message: "Error al borrar." });
    }

    return res.json({ success: true, message: "Protección eliminada correctament!" });
});


// Exportar el router para usarlo en index.js
export default router;