import express from "express";
import supabase from "../../config.js";
import multer from "multer";

// Configuración de multer para subir imágenes
const upload = multer({ storage: multer.memoryStorage() });

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

    // Buscamos las imágenes  del edificio
    const { data: images } = await supabase
        .from("building_images")
        .select("image_url")
        .eq("id_building", id);

    // Creamos un array simple de URLs con las extra
    const imagenes = images ? images.map(i => i.image_url) : [];

    // Renderizamos la vista de edificació con los datos actuales
    res.render("buildings/buildingsEdit", {
        building,
        currentPublications,
        currentArchitects,
        imagenes
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
router.post("/upload", upload.array('pictures', 10), async (req, res) => {
    // Si no hay archivos, devolvemos un error
    if (!req.files || req.files.length === 0) {
        return res.status(400).json({ success: false, message: "No s'ha pujat cap fitxer." });
    }

    try {
        // Array para almacenar las URLs públicas
        const filePaths = [];

        // Procesamos todos los archivos en paralelo
        await Promise.all(req.files.map(async (file) => {
            // Limpiamos el nombre quitando espacios y caracteres raros
            const cleanName = file.originalname.replace(/[^a-zA-Z0-9.]/g, '_');

            // Creamos nombre único con fecha 
            const fileName = `${Date.now()}_${cleanName}`;

            // Subimos a Supabase Storage
            const { data, error } = await supabase.storage
                .from('images')
                .upload(`buildings/${fileName}`, file.buffer, {
                    contentType: file.mimetype
                });

            if (error) throw error;

            //Obtenemos la URL pública
            const { data: publicUrlData } = supabase.storage
                .from('images')
                .getPublicUrl(`buildings/${fileName}`);

            //Añadimos la URL pública al array
            filePaths.push(publicUrlData.publicUrl);
        }));

        //Devolvemos el array de URLs públicas
        res.json({ success: true, filePaths });

    } catch (err) {
        console.error("Error subiendo a Supabase:", err);
        res.status(500).json({ success: false, message: "Error al pujar fitxers al núvol." });
    }
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

        // Actualizamos las imágenes 
        if (pictureUrls && pictureUrls.length > 0) {
            const newImages = pictureUrls.map(url => ({
                id_building: id,
                image_url: url
            }));
            await supabase.from("building_images").insert(newImages);
        }

        res.json({ success: true, message: "Edificació actualitzada correctament!" });

    } catch (err) {
        console.error(err);
        res.status(500).json({ success: false, message: "Error intern del servidor" });
    }
});

// Exportar el router para usarlo en index.js
export default router;