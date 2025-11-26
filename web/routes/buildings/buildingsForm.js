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

// Rutas para obtener datos relacionados para el formulario (publications, architects, typologies, protections, nomenclature)
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

router.get("/nomenclature", async (req, res) => {
    const { data } = await supabase
        .from("nomenclature")
        .select("id_nomenclature, name");
    res.json(data || []);
});

// Ruta para manejar la subida de imágenes
router.post("/upload", upload.single('picture'), (req, res) => {
    if (!req.file) {
        return res.status(400).json({ success: false, message: "No se ha subido ningún archivo." });
    }
    // Devolver la ruta del archivo subido
    const filePath = `/images/buildings/${req.file.filename}`;
    res.json({ success: true, filePath });
});

// Ruta para manejar el envío del formulario de nueva construcción
router.post("/", async (req, res) => {
    const {
        nom, adreca, any_construccio, description, surface_area,
        publicacio_id, arquitectes, tipologia, id_protection, id_nomenclature,
        pictureUrl
    } = req.body;
    
    try {
        // Insertar la nueva construcción en la base de datos
        const { error } = await supabase.from("buildings").insert([{
            name: nom,
            picture: pictureUrl,
            location: adreca,
            construction_year: parseInt(any_construccio),
            description,
            surface_area: parseInt(surface_area),
            id_publication: parseInt(publicacio_id),
            id_architect: parseInt(arquitectes),
            id_typology: parseInt(tipologia),
            id_protection: parseInt(id_protection),
            id_nomenclature: parseInt(id_nomenclature)
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