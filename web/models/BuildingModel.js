import supabase from "../config.js";

// Modelo de edificaciones
export class BuildingModel {

    // Método para obtener todas las construcciones
    static async getAll(page = 1, limit = 15, filters = {}) {
        let selectQuery = "*, building_images(image_url)";

        if (filters.image === 'true') {
            selectQuery = "*, building_images!inner(image_url)";
        }

        // Si filtramos por publicación, necesitamos hacer join con la tabla intermedia
        if (filters.publication && filters.publication !== 'all') {
            selectQuery += `, building_publications!inner(id_publication)`;
        }

        let query = supabase
            .from("buildings")
            .select(selectQuery, { count: 'exact' })
            .order("name");

        // Filtros
        if (filters.search) {
            query = query.or(`name.ilike.%${filters.search}%,location.ilike.%${filters.search}%`);
        }

        if (filters.validated && filters.validated !== 'all') {
            const isValid = filters.validated === 'true';
            query = query.eq('validated', isValid);
        }

        if (filters.publication && filters.publication !== 'all') {
            query = query.eq('building_publications.id_publication', parseInt(filters.publication));
        }

        // Paginación
        if (page && limit) {
            const from = (page - 1) * limit;
            const to = from + limit - 1;
            query = query.range(from, to);
        }

        const { data, count, error } = await query;

        if (error) throw error;

        return {
            data,
            count,
            page,
            limit,
            totalPages: Math.ceil(count / limit)
        };
    }

    // Método para obtener una construcción por ID
    static async getById(id) {
        const { data, error } = await supabase
            .from("buildings")
            .select("*")
            .eq("id_building", id)
            .single();

        if (error) throw error;
        return data;
    }

    // Método para obtener datos relacionados (imágenes, arquitectos, publicaciones, descripciones extra)
    static async getRelatedData(id) {
        // Ejecutamos las consultas en paralelo
        const [pubRes, arqRes, imgRes, descRes, reformsRes] = await Promise.all([
            supabase.from("building_publications").select("id_publication").eq("id_building", id),
            supabase.from("building_architects").select("id_architect").eq("id_building", id),
            supabase.from("building_images").select("image_url").eq("id_building", id),
            supabase.from("buildings_descriptions").select("*").eq("id_building", id).order('display_order', { ascending: true }),
            supabase.from("building_reform").select("id_reform").eq("id_building", id)
        ]);

        if (pubRes.error) throw pubRes.error;
        if (arqRes.error) throw arqRes.error;
        if (imgRes.error) throw imgRes.error;
        if (descRes.error) throw descRes.error;
        if (reformsRes.error) throw reformsRes.error;

        return {
            publications: pubRes.data.map(r => r.id_publication),
            architects: arqRes.data.map(r => r.id_architect),
            images: imgRes.data.map(r => r.image_url),
            descriptions: descRes.data, // Array de objetos {id_description, content, display_order...}
            reforms: reformsRes.data.map(r => r.id_reform)
        };
    }

    // Método para obtener tipologías filtradas por publicaciones
    static async getTypologiesByPublicationIds(idsArray) {
        const { data, error } = await supabase
            .from('publication_typologies')
            .select(`
                id_typology,
                typology ( * )
            `)
            .in('id_publication', idsArray);

        if (error) throw error;

        const formattedData = data.map(item => item.typology);
        const uniqueTypologies = Array.from(new Map(formattedData.map(item => [item.id_typology, item])).values());

        return uniqueTypologies;
    }

    // Método para subir imágenes al Storage
    static async uploadImages(files) {
        const filePaths = [];

        await Promise.all(files.map(async (file) => {
            const cleanName = file.originalname.replace(/[^a-zA-Z0-9.]/g, '_');
            const fileName = `${Date.now()}_${cleanName}`;

            const { error } = await supabase.storage
                .from('images')
                .upload(`buildings/${fileName}`, file.buffer, {
                    contentType: file.mimetype
                });

            if (error) throw error;

            const { data } = supabase.storage
                .from('images')
                .getPublicUrl(`buildings/${fileName}`);

            filePaths.push(data.publicUrl);
        }));

        return filePaths;
    }

    // Método para crear una construcción completa
    static async create(buildingData, relations, descriptionsArray) {
        // 1. Insertamos el edificio
        const { data: newBuilding, error } = await supabase
            .from("buildings")
            .insert([buildingData])
            .select()
            .single();

        if (error) throw error;

        const buildingId = newBuilding.id_building;

        // 2. Insertamos relaciones (Arquitectos)
        if (relations.architects && relations.architects.length > 0) {
            const inserts = relations.architects.map(id => ({
                id_building: buildingId,
                id_architect: parseInt(id)
            }));
            const { error: err } = await supabase.from("building_architects").insert(inserts);
            if (err) throw err;
        }

        // 3. Insertamos relaciones (Publicaciones)
        if (relations.publications && relations.publications.length > 0) {
            const inserts = relations.publications.map(id => ({
                id_building: buildingId,
                id_publication: parseInt(id)
            }));
            const { error: err } = await supabase.from("building_publications").insert(inserts);
            if (err) throw err;
        }

        // 4. Insertamos relaciones (Imágenes)
        if (relations.pictureUrls && relations.pictureUrls.length > 0) {
            const inserts = relations.pictureUrls.map(url => ({
                id_building: buildingId,
                image_url: url
            }));
            const { error: err } = await supabase.from("building_images").insert(inserts);
            if (err) throw err;
        }

        // 5. Insertamos relaciones (Descripciones)
        if (descriptionsArray && descriptionsArray.length > 0) {
            const descriptionInserts = descriptionsArray.map((text, index) => ({
                id_building: buildingId,
                content: text,
                display_order: index
            }));
            const { error: err } = await supabase.from("buildings_descriptions").insert(descriptionInserts);
            if (err) throw err;
        }

        // 6. Insertamos relaciones (Reformas)
        if (relations.reforms && relations.reforms.length > 0) {
            const inserts = relations.reforms.map(id => ({
                id_building: buildingId,
                id_reform: parseInt(id)
            }));
            const { error: err } = await supabase.from("building_reform").insert(inserts);
            if (err) throw err;
        }

        return true;
    }

    // Método para actualizar una construcción completa
    static async update(id, buildingData, relations, descriptionsArray) {
        // 1. Actualizamos datos básicos
        const { error } = await supabase
            .from("buildings")
            .update(buildingData)
            .eq("id_building", id);

        if (error) throw error;

        // 2. Actualizamos Arquitectos (Borrar y reinsertar)
        if (relations.architects) {
            await supabase.from("building_architects").delete().eq("id_building", id);
            if (relations.architects.length > 0) {
                const inserts = relations.architects.map(aid => ({
                    id_building: id,
                    id_architect: parseInt(aid)
                }));
                const { error: err } = await supabase.from("building_architects").insert(inserts);
                if (err) throw err;
            }
        }

        // 3. Actualizamos Publicaciones (Borrar y reinsertar)
        if (relations.publications) {
            await supabase.from("building_publications").delete().eq("id_building", id);
            if (relations.publications.length > 0) {
                const inserts = relations.publications.map(pid => ({
                    id_building: id,
                    id_publication: parseInt(pid)
                }));
                const { error: err } = await supabase.from("building_publications").insert(inserts);
                if (err) throw err;
            }
        }

        // 4. Añadimos nuevas imágenes
        if (relations.pictureUrls && relations.pictureUrls.length > 0) {
            const inserts = relations.pictureUrls.map(url => ({
                id_building: id,
                image_url: url
            }));
            const { error: err } = await supabase.from("building_images").insert(inserts);
            if (err) throw err;
        }

        if (relations.reforms) {
            await supabase.from("building_reform").delete().eq("id_building", id);
            if (relations.reforms.length > 0) {
                const inserts = relations.reforms.map(rid => ({
                    id_building: id,
                    id_reform: parseInt(rid)
                }));
                const { error: err } = await supabase.from("building_reform").insert(inserts);
                if (err) throw err;
            }
        }


        const { error: deleteDescError } = await supabase
            .from("buildings_descriptions")
            .delete()
            .eq("id_building", id);

        if (deleteDescError) throw deleteDescError;

        if (descriptionsArray && descriptionsArray.length > 0) {
            const descriptionInserts = descriptionsArray.map((text, index) => ({
                id_building: id,
                content: text,
                display_order: index
            }));
            const { error: err } = await supabase.from("buildings_descriptions").insert(descriptionInserts);
            if (err) throw err;
        }

        return true;
    }

    // Método para eliminar una construcción y sus recursos
    static async delete(id) {
        // 1. Recogemos las imágenes para borrarlas del Storage
        const { data: images, error: findError } = await supabase
            .from("building_images")
            .select("image_url")
            .eq("id_building", id);

        if (findError) throw findError;

        if (images && images.length > 0) {
            // Extraemos las rutas relativas
            const pathsToDelete = images.map(img => {
                const parts = img.image_url.split('/images/');
                return parts.length > 1 ? parts[1] : null;
            }).filter(path => path !== null);

            // Borramos del storage
            if (pathsToDelete.length > 0) {
                const { error: storageError } = await supabase.storage
                    .from('images')
                    .remove(pathsToDelete);

                if (storageError) console.error("Error borrando archivos de Storage:", storageError);
            }
        }

        // 2. Borramos la construcción de la BDD (Cascade se encarga de las relaciones)
        const { error } = await supabase
            .from("buildings")
            .delete()
            .eq("id_building", id);

        if (error) throw error;
        return true;
    }

    // Método para validar una construcción
    static async validate(id, validated) {
        const { error } = await supabase
            .from('buildings')
            .update({ validated })
            .eq('id_building', id);

        if (error) throw error;
        return true;
    }
}