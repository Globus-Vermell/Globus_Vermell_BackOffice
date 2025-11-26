import express from "express";
import supabase from "../../config.js";


// Constante y configuración del srvidor Express
const router = express.Router();


// Ruta para obtener todos los arquitectos
router.get("/", async (req, res) => {
    const { data: architects, error } = await supabase
        .from("architects")
        .select("*")
        .order("name");

    if (error) {
        console.error("Error al obtener arquitectos:", error);
        return res.status(500).send("Error al obtener arquitectos");
    }

    res.render("architects/architects", { architects });
});

// Ruta para eliminar un arquitecto
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


// Exportar el router para usarlo en index.js
export default router;