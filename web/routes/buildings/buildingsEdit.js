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
        nom,
        adreca,
        cordenades,
        any_construccio,
        picture,
        description,
        surface_area,
        publicacio_id,
        arquitectes,
        tipologia,
        id_protection,
    } = req.body;

    try {

        // Actualizar el edificio en la base de datos
        const { error } = await supabase
            .from("buildings")
            .update({
                name: nom,
                location: adreca,
                coordinates: cordenades,
                construction_year: parseInt(any_construccio),
                picture,
                description,
                surface_area: parseInt(surface_area),
                id_publication: parseInt(publicacio_id),
                id_architect: parseInt(arquitectes),
                id_typology: parseInt(tipologia),
                id_protection: parseInt(id_protection)
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