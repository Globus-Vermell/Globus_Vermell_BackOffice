import express from "express";
import supabase from "../../config.js";

// Constante y configuración del srvidor Express
const router = express.Router();

// Ruta para mostrar el formulario de nueva publicación

router.get("/", async (req, res) => {
    // Obtenemos todas las tipologías para mostrarlas en el formulario
    const { data: typologies, error } = await supabase
        .from("typology")
        .select("*")
        .order("name");

    if (error) console.error(error);

    res.render("publications/publicationsForm", { typologies: typologies });
});

// Ruta para manejar el envío del formulario de nueva publicación
router.post("/", async (req, res) => {
    const { title, description, themes, acknowledgment, publication_edition, selectedTypologies } = req.body;
    // Validamos que los campos obligatorios no estén vacíos
    if (!title || !themes || !publication_edition) {
        return res.status(400).json({
            success: false,
            message: "Els camps title, themes i publication_edition són obligatoris."
        });
    }

    try {
        //Insertamos la publicación a la base de datos
        const { data: pubData, error: pubError } = await supabase
            .from("publications")
            .insert([{
                title,
                description: description || null,
                themes,
                acknowledgment: acknowledgment || null,
                publication_edition
            }])
            .select();

        if (pubError) throw pubError;

        // Obtenemos el ID de la publicación recién insertada
        const newPubId = pubData[0].id_publication;

        // Validamos que se hayan seleccionado tipologías
        if (selectedTypologies && selectedTypologies.length > 0) {
            // Convertimos si es un solo string a array, o usamos el array directamente
            const typeIds = Array.isArray(selectedTypologies) ? selectedTypologies : [selectedTypologies];

            // Insertamos las relaciones entre publicación y tipología
            const insertData = typeIds.map(typeId => ({
                id_publication: newPubId,
                id_typology: parseInt(typeId)
            }));

            // Insertamos las relaciones entre publicación y tipología
            const { error: relError } = await supabase
                .from("publication_typologies")
                .insert(insertData);

            if (relError) throw relError;
        }

        return res.json({ success: true, message: "Publicació guardada correctament!" });
    } catch (err) {
        console.error("Error:", err);
        return res.status(500).json({ success: false, message: "Error intern del servidor" });
    }
});

// Exportar el router para usarlo en index.js
export default router;