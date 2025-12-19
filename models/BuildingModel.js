import supabase from "../config.js";
import BaseModel from "./BaseModel.js";

/**
 * Modelo de edificacions
 * Maneja todas las operaciones en la base de datos relacionadas con edificaciones.
 */
export class BuildingModel extends BaseModel {

    /**
     * Función getAll
     * Obtiene todas las edificaciones.
     * @param {number} page - Página actual
     * @param {number} limit - Límite de resultados por página
     * @param {Object} filters - Filtros de búsqueda
     * @returns {Promise<Array<Object>>} Array con los datos de las edificaciones
     */
    static async getAll(page = 1, limit = 15, filters = {}) {
        let selectQuery = "*, building_images(image_url)";

        if (filters.image === 'true') {
            selectQuery = "*, building_images!inner(image_url)";
        }

        if (filters.publication && filters.publication !== 'all') {
            selectQuery += `, building_publications!inner(id_publication)`;
        }

        let query = supabase
            .from("buildings")
            .select(selectQuery, { count: 'exact' })
            .order("name");

        if (filters.search) {
            query = query.or(`name.ilike.%${filters.search}%,location.ilike.%${filters.search}%`);
        }

        if (filters.validated && filters.validated !== 'all') {
            query = query.eq('validated', filters.validated === 'true');
        }

        if (filters.publication && filters.publication !== 'all') {
            query = query.eq('building_publications.id_publication', parseInt(filters.publication));
        }

        query = this.applyPagination(query, page, limit);

        const { data, count, error } = await query;
        if (error) throw error;

        return {
            data: data || [],
            ...this.getPaginationMetadata(count || 0, page, limit)
        };
    }

    /**
     * Función getById
     * Obtiene una edificación mediante su ID.
     * @param {number} id - ID de la edificación
     * @returns {Promise<Object>} Objeto con los datos de la edificación
     */
    static async getById(id) {
        const { data, error } = await supabase
            .from("buildings")
            .select("*")
            .eq("id_building", id)
            .single();

        if (error) throw error;
        return data;
    }

    /**
     * Función getRelatedData
     * Obtiene datos relacionados (imágenes, arquitectos, publicaciones, descripciones extra).
     * @param {number} id - ID de la edificación
     * @returns {Promise<Object>} Objeto con los datos relacionados
     */
    static async getRelatedData(id) {
        // Ejecutamos las consultas en paralelo
        const [pubRes, arqRes, imgRes, descRes, reformsRes, prizesRes] = await Promise.all([
            supabase.from("building_publications").select("id_publication").eq("id_building", id),
            supabase.from("building_architects").select("id_architect").eq("id_building", id),
            supabase.from("building_images").select("image_url").eq("id_building", id),
            supabase.from("buildings_descriptions").select("*").eq("id_building", id).order('display_order', { ascending: true }),
            supabase.from("building_reform").select("id_reform").eq("id_building", id),
            supabase.from("building_prizes").select("id_prize").eq("id_building", id)
        ]);

        if (pubRes.error) throw pubRes.error;
        if (arqRes.error) throw arqRes.error;
        if (imgRes.error) throw imgRes.error;
        if (descRes.error) throw descRes.error;
        if (reformsRes.error) throw reformsRes.error;
        if (prizesRes.error) throw prizesRes.error;

        return {
            publications: pubRes.data.map(r => r.id_publication),
            architects: arqRes.data.map(r => r.id_architect),
            images: imgRes.data.map(r => r.image_url),
            descriptions: descRes.data,
            reforms: reformsRes.data.map(r => r.id_reform),
            prizes: prizesRes.data.map(r => r.id_prize)
        };
    }

    /**
     * Función getTypologiesByPublicationIds
     * Obtiene tipologías filtradas por publicaciones.
     * @param {Array<number>} idsArray - Array de IDs de publicaciones
     * @returns {Promise<Array<Object>>} Array con los datos de las tipologías
     */
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

    /**
     * Función uploadImages
     * Sube imágenes al Storage.
     * @param {Array<File>} files - Array de archivos a subir
     * @returns {Promise<Array<string>>} Array con las URLs de las imágenes subidas
     */
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

    /**
     * Función create
     * Crea una edificación completa.
     * @param {Object} buildingData - Datos de la edificación
     * @param {Object} relations - Relaciones (arquitectos, publicaciones, etc.)
     * @param {Array<Object>} descriptionsArray - Array de descripciones extra
     * @returns {Promise<Object>} Objeto con los datos de la edificación creada
     */
    static async create(buildingData, relations, descriptionsArray) {
        const { data: newBuilding, error } = await supabase
            .from("buildings")
            .insert([buildingData])
            .select()
            .single();

        if (error) throw error;

        const buildingId = newBuilding.id_building;

        if (relations.architects && relations.architects.length > 0) {
            const inserts = relations.architects.map(id => ({
                id_building: buildingId,
                id_architect: parseInt(id)
            }));
            const { error: err } = await supabase.from("building_architects").insert(inserts);
            if (err) throw err;
        }

        if (relations.publications && relations.publications.length > 0) {
            const inserts = relations.publications.map(id => ({
                id_building: buildingId,
                id_publication: parseInt(id)
            }));
            const { error: err } = await supabase.from("building_publications").insert(inserts);
            if (err) throw err;
        }

        if (relations.pictureUrls && relations.pictureUrls.length > 0) {
            const inserts = relations.pictureUrls.map(url => ({
                id_building: buildingId,
                image_url: url
            }));
            const { error: err } = await supabase.from("building_images").insert(inserts);
            if (err) throw err;
        }

        if (descriptionsArray && descriptionsArray.length > 0) {
            const descriptionInserts = descriptionsArray.map((text, index) => ({
                id_building: buildingId,
                content: text,
                display_order: index
            }));
            const { error: err } = await supabase.from("buildings_descriptions").insert(descriptionInserts);
            if (err) throw err;
        }

        if (relations.reforms && relations.reforms.length > 0) {
            const inserts = relations.reforms.map(id => ({
                id_building: buildingId,
                id_reform: parseInt(id)
            }));
            const { error: err } = await supabase.from("building_reform").insert(inserts);
            if (err) throw err;
        }

        if (relations.prizes && relations.prizes.length > 0) {
            const inserts = relations.prizes.map(id => ({
                id_building: buildingId,
                id_prize: parseInt(id)
            }));
            const { error: err } = await supabase.from("building_prizes").insert(inserts);
            if (err) throw err;
        }

        return true;
    }

    /**
     * Función update
     * Actualiza una edificación completa.
     * @param {number} id - ID de la edificación
     * @param {Object} buildingData - Datos de la edificación
     * @param {Object} relations - Relaciones (arquitectos, publicaciones, etc.)
     * @param {Array<Object>} descriptionsArray - Array de descripciones extra
     * @returns {Promise<boolean>} true si se actualizó correctamente
     */
    static async update(id, buildingData, relations, descriptionsArray) {
        const { error } = await supabase
            .from("buildings")
            .update(buildingData)
            .eq("id_building", id);

        if (error) throw error;

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
        if (relations.prizes) {
            await supabase.from("building_prizes").delete().eq("id_building", id);
            if (relations.prizes.length > 0) {
                const inserts = relations.prizes.map(pid => ({
                    id_building: id,
                    id_prize: parseInt(pid)
                }));
                const { error: err } = await supabase.from("building_prizes").insert(inserts);
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

    /**
     * Función delete
     * Elimina una edificación y sus recursos.
     * @param {number} id - ID de la edificación
     * @returns {Promise<boolean>} true si se eliminó correctamente
     */
    static async delete(id) {
        const { data: images, error: findError } = await supabase
            .from("building_images")
            .select("image_url")
            .eq("id_building", id);

        if (findError) throw findError;

        if (images && images.length > 0) {
            const pathsToDelete = images.map(img => {
                const parts = img.image_url.split('/images/');
                return parts.length > 1 ? parts[1] : null;
            }).filter(path => path !== null);

            if (pathsToDelete.length > 0) {
                const { error: storageError } = await supabase.storage
                    .from('images')
                    .remove(pathsToDelete);

                if (storageError) console.error("Error borrando archivos de Storage:", storageError);
            }
        }

        const { error } = await supabase
            .from("buildings")
            .delete()
            .eq("id_building", id);

        if (error) throw error;
        return true;
    }

    /**
     * Función validate
     * Valida una edificación.
     * @param {number} id - ID de la edificación
     * @param {boolean} validated - Valor de validación
     * @returns {Promise<boolean>} true si se validó correctamente
     */
    static async validate(id, validated) {
        const { error } = await supabase
            .from('buildings')
            .update({ validated })
            .eq('id_building', id);

        if (error) throw error;
        return true;
    }
}