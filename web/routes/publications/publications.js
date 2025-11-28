import express from "express";
import supabase from "../../config.js";

// Constante y configuración del srvidor Express
const router = express.Router();

// Ruta para obtener todas las construcciones
router.get("/", async (req, res) => {
    const { data: publications, error } = await supabase
        .from("publications")
        .select("*")
        .order("title");

    if (error) {
        console.error("Error al obtener publicaciones:", error);
        return res.status(500).send("Error al obtener publicaciones");
    }
    res.render("publications/publications", { publications });
});

// Ruta para eliminar una construcción
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
// Ruta para validar una publicación
router.put('/validation/:id', async (req, res) => {
    const id = Number(req.params.id);
    const { validated } = req.body;
    try {
        // Actualizamos la publicación
        const { error: updateError } = await supabase
            .from('publications')
            .update({ validated })
            .eq('id_publication', id);

        if (updateError) throw updateError;
        res.json({ success: true, message: 'Estat de validació actualitzat correctament!' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ success: false, message: 'Error intern del servidor' });
    }
});
// Exportar el router para usarlo en index.js
export default router;