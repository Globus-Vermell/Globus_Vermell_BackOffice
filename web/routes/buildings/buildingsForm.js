import express from "express";
import supabase from "../../config.js";
import multer from "multer";

// Configuración de multer para manejar la subida de archivos
const upload = multer({ dest: 'public/images/buildings' });

// Constante y configuración del srvidor Express
const router = express.Router();


// Ruta para mostrar el formulario de nueva construcción
router.get("/", (req, res) => {
    res.render("buildings/buildingsForm");
});

// Rutas para obtener datos relacionados para el formulario (publications, architects, typologies, protections)
router.get("/publications", async (req, res) => {
    const { data } = await supabase
        .from("publications")
        .select("id_publication, title");
    res.json(data || []);
});

router.get("/architects", async (req, res) => {
    const { data } = await supabase
        .from("architects")
        .select("id_architect, name");
    res.json(data || []);
});

router.get("/typologies", async (req, res) => {
    const { data } = await supabase
        .from("typology")
        .select("id_typology, name");
    res.json(data || []);
});

router.get("/protection", async (req, res) => {
    const { data } = await supabase
        .from("protection")
        .select("id_protection, level");
    res.json(data || []);
});

// Ruta para obtener tipologías filtradas por publicación
router.get("/typologies/:publicationId", async (req, res) => {
    const pubId = parseInt(req.params.publicationId);

    // Hacemos un Join para obtener las tipologías de la tabla intermedia
    const { data, error } = await supabase
        .from('publication_typologies')
        .select(`
            id_typology,
            typology ( * )
        `)
        .eq('id_publication', pubId);

    if (error) {
        console.error("Error obteniendo tipologías por publicación:", error);
        return res.status(500).json([]);
    }
    // Limpiamos la respuesta para devolver solo el array de objetos 'typology'
    const formattedData = data.map(item => item.typology);
    res.json(formattedData);
});

// Ruta para manejar la subida de imágenes
router.post("/upload", upload.array('pictures', 10), (req, res) => {
    if (!req.files || req.files.length === 0) {
        return res.status(400).json({ success: false, message: "No s'ha pujat cap fitxer." });
    }
    // Devolvemos un array de rutas
    const filePaths = req.files.map(f => `/images/buildings/${f.filename}`);
    res.json({ success: true, filePaths });
});

// Ruta para manejar el envío del formulario de nueva construcción
router.post("/", async (req, res) => {
    const {
        name, address, construction_year, description, surface_area,
        publications, architects, tipologies, protection,
        pictureUrl, coordinates
    } = req.body;

    try {
        // Insertar la nueva construcción en la base de datos
        const { error } = await supabase.from("buildings").insert([{
            name,
            picture: pictureUrl,
            location: address,
            coordinates,
            construction_year: parseInt(construction_year),
            description,
            surface_area: parseInt(surface_area),
            id_publication: parseInt(publications),
            id_architect: parseInt(architects),
            id_typology: parseInt(tipologies),
            id_protection: parseInt(protection),
        }]);
        if (error) throw error;
        res.json({ success: true, message: "Edificación guardada correctamente!" });
    } catch (err) {
        console.error("Error:", err);
        res.status(500).json({ success: false, message: "Error interno del servidor" });
    }
});

// Exportar el router para usarlo en index.js
export default router;