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
            .select("*, building_images(image_url)")
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
    // Recogemos el ID de la construcción
    const id = Number(req.params.id);

    try {
        // Recogemos las imágenes de la construcción
        const { data: images, error: findError } = await supabase
            .from("building_images")
            .select("image_url")
            .eq("id_building", id);

        if (findError) throw findError;

        // Si hay imágenes, las recogemos para borrarlas
        if (images && images.length > 0) {

            // Extraemos las rutas de las imágenes
            const pathsToDelete = images.map(img => {
                // Extraemos la ruta de la imagen
                const parts = img.image_url.split('/images/');
                // Devolvemos la ruta de la imagen
                return parts.length > 1 ? parts[1] : null;
            }).filter(path => path !== null);

            // Si hay imágenes, las borramos del storage
            if (pathsToDelete.length > 0) {
                // Borramos las imágenes del storage
                const { error: storageError } = await supabase.storage
                    .from('images')
                    .remove(pathsToDelete);

                if (storageError) {
                    console.error("Error borrando archivos de Storage:", storageError);
                }
            }
        }

        // Borramos la construcción
        const { error } = await supabase
            .from("buildings")
            .delete()
            .eq("id_building", id);

        if (error) throw error;

        return res.json({ success: true, message: "Edificació eliminada correctament!" });

    } catch (err) {
        console.error("Error borrando:", err);
        return res.status(500).json({ success: false, message: "Error al borrar." });
    }
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