import express from "express";
import supabase from "../../config.js";
import multer from "multer";

// Configuración de multer para manejar la subida de archivos
const upload = multer({ storage: multer.memoryStorage() });

// Constante y configuración del servidor Express
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

// Ruta para manejar el envío del formulario de nueva construcción
router.post("/", async (req, res) => {
    //Recibimos los datos del formulario
    const {
        name, address, construction_year, description, surface_area,
        publications, architects, tipologies, protection,
        coordinates, pictureUrls
    } = req.body;

    try {
        //Definimos la imagen principal
        const mainPicture = pictureUrls[0];

        //Insertamos el edificio
        const { data: newBuilding, error: buildError } = await supabase
            .from("buildings")
            .insert([{
                name,
                location: address,
                coordinates,
                construction_year: parseInt(construction_year),
                description,
                surface_area: surface_area ? parseInt(surface_area) : null,
                id_typology: parseInt(tipologies),
                id_protection: protection ? parseInt(protection) : null,
            }])
            .select()
            .single();

        //Si hay error, lo lanzamos
        if (buildError) throw buildError;

        //Obtenemos el id del edificio insertado
        const buildingId = newBuilding.id_building;

        //Si hay arquitectos, los insertamos
        if (architects && architects.length > 0) {
            //Definimos los ids de los arquitectos
            const archIds = Array.isArray(architects) ? architects : [architects];

            // Guardamos los arquitectos mediante un array de objetos
            const archInserts = archIds.map(id => ({
                id_building: buildingId,
                id_architect: parseInt(id)
            }));
            //Insertamos los arquitectos
            const { error: archErr } = await supabase
                .from("building_architects")
                .insert(archInserts);
            if (archErr) throw archErr;
        }

        //Si hay publicaciones, las insertamos
        if (publications && publications.length > 0) {
            //Definimos los ids de las publicaciones
            const pubIds = Array.isArray(publications) ? publications : [publications];

            //Guardamos las publicaciones mediante un array de objetos
            const pubInserts = pubIds.map(id => ({
                id_building: buildingId,
                id_publication: parseInt(id)
            }));

            //Insertamos las publicaciones
            const { error: pubErr } = await supabase
                .from("building_publications")
                .insert(pubInserts);
            if (pubErr) throw pubErr;
        }

        //Si hay imágenes, las insertamos
        if (pictureUrls && pictureUrls.length > 0) {
            const allImages = pictureUrls.map(url => ({
                id_building: buildingId,
                image_url: url
            }));
            await supabase.from("building_images").insert(allImages);
        }

        //Devolvemos un mensaje de éxito
        res.json({ success: true, message: "Edificació guardada correctament!" });

    } catch (err) {
        console.error("Error:", err);
        res.status(500).json({ success: false, message: "Error interno del servidor: " + err.message });
    }
});

//exportar el router
export default router;