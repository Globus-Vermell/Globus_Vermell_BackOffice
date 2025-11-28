import express from "express";
import supabase from "../../config.js";

// Constante y configuración del srvidor Express
const router = express.Router();

// Ruta para obtener todas las construcciones
router.get("/", async (req, res) => {
try {
        // 1. Petición para obtener los edificios (igual que antes)
        const buildingsQuery = supabase
            .from("buildings")
            .select("*")
            .order("name");

        // 2. Petición para obtener las publicaciones (NUEVO)
        const publicationsQuery = supabase
            .from("publications") 
            .select("*")
            .order("title"); // Opcional: ordenarlas alfabéticamente para el select

        // Ejecutamos ambas peticiones a la vez 
        const [buildingsResult, publicationsResult] = await Promise.all([
            buildingsQuery,
            publicationsQuery
        ]);

        // Verificamos si hubo error en alguna de las dos
        if (buildingsResult.error || publicationsResult.error) {
            console.error("Error en DB:", buildingsResult.error || publicationsResult.error);
            return res.status(500).send("Error al obtener datos");
        }

        // 3. Renderizamos pasando AMBAS listas a la vista
        res.render("buildings/buildings", { 
            buildings: buildingsResult.data, 
            publications: publicationsResult.data // <--- Esto es lo que usará el <select> del EJS
        });

    } catch (err) {
        console.error("Error inesperado:", err);
        res.status(500).send("Error del servidor");
    }
});

// Ruta para eliminar una construcción
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

// Ruta para validar una edificación
router.put('/validation/:id', async (req, res) => {
    const id = Number(req.params.id);
    const { validated } = req.body;
    try {
        // Actualizamos la construcción
        const { error: updateError } = await supabase
            .from('buildings')
            .update({ validated })
            .eq('id_building', id);

        if (updateError) throw updateError;
        res.json({ success: true, message: 'Estat de validació actualitzat correctament!' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ success: false, message: 'Error intern del servidor' });
    }
});

// Exportar el router para usarlo en index.js
export default router;