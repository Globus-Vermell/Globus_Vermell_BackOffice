import supabase from "../config.js";
import BaseModel from "./BaseModel.js";

/**
 * Modelo de publicaciones
 * Maneja todas las operaciones en la base de datos relacionadas con publicaciones.
 */
export class PublicationModel extends BaseModel {

    /**
     * Función getAll
     * Obtiene todas las publicaciones y filtros.
     * @param {number} page - Número de página
     * @param {number} limit - Límite de registros por página
     * @param {Object} filters - Filtros de búsqueda
     * @returns {Promise<Object>} Objeto con los datos de las publicaciones y metadatos de paginación
     */
    static async getAll(page = 1, limit = 15, filters = {}) {
        let query = supabase
            .from("publications")
            .select("*", { count: 'exact' })
            .order("title");

        if (filters.search) {
            query = query.or(`title.ilike.%${filters.search}%,description.ilike.%${filters.search}%`);
        }

        if (filters.validated && filters.validated !== 'all') {
            query = query.eq('validated', filters.validated === 'true');
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
     * Obtiene una publicación mediante su ID.
     * @param {number} id - ID de la publicación
     * @returns {Promise<Object>} Objeto con los datos de la publicación
     */
    static async getById(id) {
        const { data, error } = await supabase
            .from("publications")
            .select("*")
            .eq("id_publication", id)
            .single();

        if (error) throw error;
        return data;
    }

    /**
     * Función getTypologiesByPublication
     * Obtiene los IDs de las tipologías asociadas a una publicación.
     * @param {number} id - ID de la publicación
     * @returns {Promise<Array<number>>} Array con los IDs de las tipologías
     */
    static async getTypologiesByPublication(id) {
        const { data, error } = await supabase
            .from('publication_typologies')
            .select('id_typology')
            .eq('id_publication', id);

        if (error) throw error;
        return data.map(r => r.id_typology);
    }

    /**
     * Función create
     * Crea una publicación y sus relaciones.
     * @param {Object} pubData - Datos de la publicación
     * @param {Array<number>} typologyIds - IDs de las tipologías asociadas
     * @returns {Promise<boolean>} true si se creó correctamente
     */
    static async create(pubData, typologyIds) {
        const { data, error } = await supabase
            .from("publications")
            .insert([pubData])
            .select()
            .single();

        if (error) throw error;

        const newPubId = data.id_publication;

        //Si hay tipologías, insertamos las relaciones
        if (typologyIds && typologyIds.length > 0) {
            const inserts = typologyIds.map(typeId => ({
                id_publication: newPubId,
                id_typology: parseInt(typeId)
            }));

            const { error: relError } = await supabase
                .from("publication_typologies")
                .insert(inserts);

            if (relError) throw relError;
        }

        return true;
    }

    /**
     * Función update
     * Actualiza una publicación y sus relaciones.
     * @param {number} id - ID de la publicación
     * @param {Object} pubData - Datos de la publicación
     * @param {Array<number>} typologyIds - IDs de las tipologías asociadas
     * @returns {Promise<boolean>} true si se actualizó correctamente
     */
    static async update(id, pubData, typologyIds) {
        const { error: updateError } = await supabase
            .from('publications')
            .update(pubData)
            .eq('id_publication', id);

        if (updateError) throw updateError;

        const { error: deleteError } = await supabase
            .from('publication_typologies')
            .delete()
            .eq('id_publication', id);

        if (deleteError) throw deleteError;

        if (typologyIds && typologyIds.length > 0) {
            const inserts = typologyIds.map(typeId => ({
                id_publication: id,
                id_typology: parseInt(typeId)
            }));

            const { error: insertError } = await supabase
                .from('publication_typologies')
                .insert(inserts);

            if (insertError) throw insertError;
        }

        return true;
    }

    /**
     * Función delete
     * Elimina una publicación mediante su ID.
     * @param {number} id - ID de la publicación
     * @returns {Promise<boolean>} true si se eliminó correctamente
     */
    static async delete(id) {
        const { error } = await supabase
            .from("publications")
            .delete()
            .eq("id_publication", id);

        if (error) throw error;
        return true;
    }

    /**
     * Función updateValidation
     * Valida/invalida una publicación mediante su ID.
     * @param {number} id - ID de la publicación
     * @param {boolean} validated - Valor de validación
     * @returns {Promise<boolean>} true si se validó/invalidó correctamente
     */
    static async updateValidation(id, validated) {
        const { error } = await supabase
            .from('publications')
            .update({ validated })
            .eq('id_publication', id);

        if (error) throw error;
        return true;
    }
}