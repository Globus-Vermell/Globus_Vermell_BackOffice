import express from "express";
import supabase from "../../config.js";
import multer from "multer";

// Configuración de multer para subir imágenes
const upload = multer({ dest: 'public/images/buildings' });

// Constante y configuración del srvidor Express
const router = express.Router();

// Ruta para obtener un edificio por ID para editar
router.get("/:id", async (req, res) => {
    const id = Number(req.params.id);

    const { data: building, error: buildingError } = await supabase
        .from("buildings")
        .select("*")
        .eq("id_building", id)
        .single();

    if (buildingError || !building) {
        console.error("Error al obtener building:", buildingError);
        return res.status(404).send("Edificació no trobada");
    }
    res.render("buildings/buildingsEdit", { building });

});

// Ruta para obtener datos relacionados para el formulario de edición ( publications, architects, typologies, protections)
router.get("/:id/publications", async (req, res) => {
    const { data, error } = await supabase
        .from("publications")
        .select("id_publication, title");
    if (error) return res.status(500).json({ error: error.message });
    res.json(data || []);
});

router.get("/:id/architects", async (req, res) => {
    const { data, error } = await supabase
        .from("architects")
        .select("id_architect, name");
    if (error) return res.status(500).json({ error: error.message });
    res.json(data || []);
});

router.get("/:id/typologies", async (req, res) => {
    const { data, error } = await supabase
        .from("typology")
        .select("id_typology, name");
    if (error) return res.status(500).json({ error: error.message });
    res.json(data || []);
});

router.get("/:id/protections", async (req, res) => {
    const { data, error } = await supabase
        .from("protection")
        .select("id_protection, level");
    if (error) return res.status(500).json({ error: error.message });
    res.json(data || []);
});

// Ruta para obtener tipologías filtradas por publicación (para uso del frontend)
router.get("/typologies-by-publication/:publicationId", async (req, res) => {
    // Obtenemos el ID de la publicación
    const pubId = parseInt(req.params.publicationId);

    // Obtenemos las tipologías filtradas por publicación
    const { data, error } = await supabase
        .from('publication_typologies')
        .select(`
            id_typology,
            typology ( * )
        `)
        .eq('id_publication', pubId);

    if (error) {
        console.error("Error obtenint tipologies per publicació:", error);
        return res.status(500).json([]);
    }

    // Formatear la respuesta para devolver solo el array de tipologías
    const formattedData = data.map(item => item.typology);

    res.json(formattedData || []);
});

// Ruta para manejar la subida de imágenes en la edición
router.post("/upload", upload.single('picture'), (req, res) => {
    if (!req.file) {
        return res.status(400).json({ success: false, message: "No se ha subido ningún archivo." });
    }
    // Devolver la ruta del archivo subido
    const filePath = `/images/buildings/${req.file.filename}`;
    res.json({ success: true, filePath });
});

// Ruta para actualizar un edificio
router.put("/:id", async (req, res) => {
    const id = Number(req.params.id);
    const {
        name,
        address,
        coordinates,
        construction_year,
        picture,
        description,
        surface_area,
        publications,
        architects,
        tipologies,
        protection,
    } = req.body;

    try {

        // Actualizar el edificio en la base de datos
        const { error } = await supabase
            .from("buildings")
            .update({
                name,
                location: address,
                coordinates,
                construction_year: parseInt(construction_year),
                picture,
                description,
                surface_area: parseInt(surface_area),
                id_publication: parseInt(publications),
                id_architect: parseInt(architects),
                id_typology: parseInt(tipologies),
                id_protection: parseInt(protection)
            })
            .eq("id_building", id);

        if (error) {
            console.error("Error al actualizar building:", error);
            return res.status(400).json({ success: false, message: "Error al actualizar la edificació" });
        }

        res.json({ success: true, message: "Edificació actualitzada correctament!" });
    } catch (err) {
        console.error(err);
        res.status(500).json({ success: false, message: "Error intern del servidor" });
    }
});


// Exportar el router para usarlo en index.js
export default router;