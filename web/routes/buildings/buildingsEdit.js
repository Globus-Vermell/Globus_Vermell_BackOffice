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

    // Buscamos el edificio por ID
    const { data: building, error: buildingError } = await supabase
        .from("buildings")
        .select("*")
        .eq("id_building", id)
        .single();

    // Si no se encuentra el edificio, devolvemos un error
    if (buildingError || !building) {
        return res.status(404).send("Edificació no trobada");
    }

    // Buscamos las publicaciones relacionadas con el edificio
    const { data: relPubs } = await supabase
        .from("building_publications")
        .select("id_publication")
        .eq("id_building", id);
    const currentPublications = relPubs ? relPubs.map(r => r.id_publication) : [];

    // Buscamos los arquitectos relacionados con el edificio
    const { data: relArqs } = await supabase
        .from("building_architects")
        .select("id_architect")
        .eq("id_building", id);
    const currentArchitects = relArqs ? relArqs.map(r => r.id_architect) : [];

    // Renderizamos la vista de edificació con los datos actuales
    res.render("buildings/buildingsEdit", {
        building,
        currentPublications,
        currentArchitects
    });
});

// Ruta para obtener tipologías filtradas por  publicaciones
router.get("/typologies/filter", async (req, res) => {
    //Recibimos los IDs por query string 
    const idsParam = req.query.ids;

    //Si no hay IDs, devolvemos un array vacío
    if (!idsParam) {
        return res.json([]);
    }

    // Convertimos el texto "1,2,3" a un array de números [1, 2, 3]
    const pubIds = idsParam.split(',').map(id => parseInt(id));

    // Hacemos un Join para obtener las tipologías de la tabla intermedia
    const { data, error } = await supabase
        .from('publication_typologies')
        .select(`
            id_typology,
            typology ( * )
        `)
        .in('id_publication', pubIds);

    if (error) {
        console.error("Error obteniendo tipologías por publicación:", error);
        return res.status(500).json([]);
    }

    // Limpiamos la respuesta para devolver solo el array de objetos 'typology'
    const formattedData = data.map(item => item.typology);

    // Eliminamos duplicados
    const uniqueTypologies = Array.from(new Map(formattedData.map(item => [item.id_typology, item])).values());

    res.json(uniqueTypologies);
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

// Ruta para actualizar un edificio
router.put("/:id", async (req, res) => {
    const id = Number(req.params.id);
    // Desestructuramos el body
    const {
        name, address, coordinates, construction_year, description,
        surface_area, tipologia, id_protection,
        architects, publications, pictureUrls
    } = req.body;

    try {
        // Preparamos los datos para la actualización
        const updateData = {
            name: name,
            location: address,
            coordinates: coordinates,
            construction_year: parseInt(construction_year),
            description,
            surface_area: parseInt(surface_area),
            id_typology: parseInt(tipologia),
            id_protection: parseInt(id_protection)
        };

        // Actualizamos la imagen principal si se sube una nueva
        if (pictureUrls && pictureUrls.length > 0) {
            updateData.picture = pictureUrls[0];
        }

        // Actualizamos el edificio
        const { error: upError } = await supabase.from("buildings").update(updateData).eq("id_building", id);
        if (upError) throw upError;

        // Actualizamos los arquitectos
        if (architects) {
            await supabase.from("building_architects").delete().eq("id_building", id);
            const archIds = Array.isArray(architects) ? architects : [architects];
            if (archIds.length > 0) {
                const inserts = archIds.map(aid => ({ id_building: id, id_architect: parseInt(aid) }));
                await supabase.from("building_architects").insert(inserts);
            }
        }

        // Actualizamos las publicaciones
        if (publications) {
            await supabase.from("building_publications").delete().eq("id_building", id);
            const pubIds = Array.isArray(publications) ? publications : [publications];
            if (pubIds.length > 0) {
                const inserts = pubIds.map(pid => ({ id_building: id, id_publication: parseInt(pid) }));
                await supabase.from("building_publications").insert(inserts);
            }
        }

        // Actualizamos las imágenes extra
        if (pictureUrls && pictureUrls.length > 1) {
            const extraImages = pictureUrls.slice(1).map(url => ({
                id_building: id,
                image_url: url
            }));
            await supabase.from("building_images").insert(extraImages);
        }

        res.json({ success: true, message: "Edificació actualitzada correctament!" });

    } catch (err) {
        console.error(err);
        res.status(500).json({ success: false, message: "Error intern del servidor" });
    }
});

// Exportar el router para usarlo en index.js
export default router;