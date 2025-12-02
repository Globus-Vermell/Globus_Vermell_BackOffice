import express from "express";
import multer from "multer";
import { BuildingModel } from "../../models/BuildingModel.js";
import { PublicationModel } from "../../models/PublicationModel.js";
import { ArchitectModel } from "../../models/ArchitectModel.js";
import { TypologyModel } from "../../models/TypologyModel.js";
import { ProtectionModel } from "../../models/ProtectionModel.js";

// Configuración de multer para manejar la subida de archivos
const upload = multer({ storage: multer.memoryStorage() });

// Constante y configuración del servidor Express
const router = express.Router();

// Ruta para mostrar el formulario de nueva construcción
router.get("/", (req, res) => {
    res.render("buildings/buildingsForm");
});

// Rutas para obtener datos relacionados para el formulario
router.get("/publications", async (req, res) => {
    try {
        const result = await PublicationModel.getAll();
        res.json(result.data || []);
    } catch (e) { res.status(500).json([]); }
});

router.get("/architects", async (req, res) => {
    try {
        const result = await ArchitectModel.getAll();
        res.json(result.data || []);
    } catch (e) { res.status(500).json([]); }
});

router.get("/typologies", async (req, res) => {
    try {
        const data = await TypologyModel.getAll();
        res.json(data || []);
    } catch (e) { res.status(500).json([]); }
});

router.get("/protection", async (req, res) => {
    try {
        const data = await ProtectionModel.getAll();
        res.json(data || []);
    } catch (e) { res.status(500).json([]); }
});

// Ruta para obtener tipologías filtradas por publicaciones
router.get("/typologies/filter", async (req, res) => {
    const idsParam = req.query.ids;
    if (!idsParam) return res.json([]);

    try {
        const pubIds = idsParam.split(',').map(id => parseInt(id));
        const typologies = await BuildingModel.getTypologiesByPublicationIds(pubIds);
        res.json(typologies);
    } catch (error) {
        console.error("Error obteniendo tipologías por publicación:", error);
        return res.status(500).json([]);
    }
});

// Ruta para manejar la subida de imágenes
router.post("/upload", upload.array('pictures', 10), async (req, res) => {
    if (!req.files || req.files.length === 0) {
        return res.status(400).json({ success: false, message: "No s'ha pujat cap fitxer." });
    }

    try {
        const filePaths = await BuildingModel.uploadImages(req.files);
        res.json({ success: true, filePaths });
    } catch (err) {
        console.error("Error subiendo a Supabase:", err);
        res.status(500).json({ success: false, message: "Error al pujar fitxers al núvol." });
    }
});

// Ruta para manejar el envío del formulario de nueva construcción
router.post("/", async (req, res) => {
    // Recibimos los datos del formulario
    const {
        name, address, construction_year, description, surface_area,
        publications, architects, tipologies, protection,
        coordinates, pictureUrls
    } = req.body;

    try {
        // Definimos los datos del edificio
        const buildingData = {
            name,
            location: address,
            coordinates,
            construction_year: parseInt(construction_year),
            description,
            surface_area: surface_area ? parseInt(surface_area) : null,
            id_typology: parseInt(tipologies),
            id_protection: protection ? parseInt(protection) : null,
        };

        // Definimos las relaciones
        const relations = {
            architects: Array.isArray(architects) ? architects : [architects],
            publications: Array.isArray(publications) ? publications : [publications],
            pictureUrls: pictureUrls || []
        };

        // Insertamos el edificio
        await BuildingModel.create(buildingData, relations);

        res.json({ success: true, message: "Edificació guardada correctament!" });

    } catch (err) {
        console.error("Error:", err);
        res.status(500).json({ success: false, message: "Error interno del servidor" });
    }
});

// exportar el router
export default router;