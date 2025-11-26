import express from "express";
import supabase from "../../config.js";


// Constante y configuración del srvidor Express
const router = express.Router();

// Ruta para obtener todas las construcciones
router.get("/", async (req, res) => {
    const { data: prizes, error } = await supabase
        .from("prizes")
        .select("*")
        .order("name");

    if (error) {
        console.error("Error al obtener premios:", error);
        return res.status(500).send("Error al obtener premios");
    }

    res.render("prizes/prizes", { prizes });
});

// Ruta para eliminar una construcción
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

// Exportar el router para usarlo en index.js
export default router;