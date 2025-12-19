import supabase from "../config.js";
import BaseModel from "./BaseModel.js";

/**
 * Modelo de reformas
 * Maneja todas las operaciones en la base de datos relacionadas con reformas.
 */
export class ReformModel extends BaseModel {
    /**
     * Función getAll
     * Obtiene todas las reformas.
     * @param {number} page - Número de página
     * @param {number} limit - Límite de registros por página
     * @param {Object} filters - Filtros de búsqueda
     * @returns {Promise<Object>} Objeto con los datos de las reformas y metadatos de paginación
     */
    static async getAll(page = 1, limit = 15, filters = {}) {
        let query;

        if (filters.search) {
            query = supabase
                .from("reform")
                .select("*, architects!inner(name)", { count: 'exact' })
                .order("year", { ascending: false })
                .ilike('architects.name', `%${filters.search}%`);
        } else {
            query = supabase
                .from("reform")
                .select("*, architects(name)", { count: 'exact' })
                .order("year", { ascending: false });
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
     * Obtiene una reforma mediante su ID.
     * @param {number} id - ID de la reforma
     * @returns {Promise<Object>} Objeto con los datos de la reforma
     */
    static async getById(id) {
        const { data, error } = await supabase
            .from("reform")
            .select("*")
            .eq("id_reform", id)
            .single();

        if (error) throw error;
        return data;
    }

    /**
     * Función create
     * Crea una reforma.
     * @param {Object} data - Datos de la reforma
     * @returns {Promise<boolean>} true si se creó correctamente
     */
    static async create(data) {
        const { error } = await supabase
            .from("reform")
            .insert([data]);

        if (error) throw error;
        return true;
    }

    /**
     * Función update
     * Actualiza una reforma mediante su ID.
     * @param {number} id - ID de la reforma
     * @param {Object} data - Datos de la reforma
     * @returns {Promise<boolean>} true si se actualizó correctamente
     */
    static async update(id, data) {
        const { error } = await supabase
            .from("reform")
            .update(data)
            .eq("id_reform", id);

        if (error) throw error;
        return true;
    }

    /**
     * Función delete
     * Elimina una reforma mediante su ID.
     * @param {number} id - ID de la reforma
     * @returns {Promise<boolean>} true si se eliminó correctamente
     */
    static async delete(id) {
        const { error } = await supabase
            .from("reform")
            .delete()
            .eq("id_reform", id);

        if (error) throw error;
        return true;
    }
}