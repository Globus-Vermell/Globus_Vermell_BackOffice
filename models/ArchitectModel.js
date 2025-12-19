import supabase from "../config.js";
import BaseModel from "./BaseModel.js";

/**
 * Modelo de arquitectos
 * Maneja todas las operaciones en la base de datos relacionadas con arquitectos.
 */
export class ArchitectModel extends BaseModel {

    /**
     * Función getAll
     * Obtiene todos los arquitectos.
     * @param {number} page - Número de página
     * @param {number} limit - Límite de registros por página
     * @param {Object} filters - Filtros de búsqueda
     * @returns {Promise<Object>} Objeto con los datos de los arquitectos y metadatos de paginación
     */
    static async getAll(page = 1, limit = 15, filters = {}) {
        let query = supabase
            .from("architects")
            .select("*", { count: 'exact' })
            .order("name");

        if (filters.search) {
            query = query.or(`name.ilike.%${filters.search}%`);
        }
        query = this.applyPagination(query, page, limit);
        const { data, count, error } = await query;
        if (error) throw error;
        return {
            data,
            ...this.getPaginationMetadata(count, page, limit)
        };
    }

    /**
     * Función getById
     * Obtiene un arquitecto mediante su ID.
     * @param {number} id - ID del arquitecto
     * @returns {Promise<Object>} Objeto con los datos del arquitecto
     */
    static async getById(id) {
        const { data, error } = await supabase
            .from("architects")
            .select("*")
            .eq("id_architect", id)
            .single();

        if (error) throw error;
        return data;
    }

    /**
     * Función create
     * Crea un arquitecto.
     * @param {Object} data - Datos del arquitecto
     * @returns {Promise<boolean>} true si se creó correctamente
     */
    static async create(data) {
        const { error } = await supabase
            .from("architects")
            .insert([data]);

        if (error) throw error;
        return true;
    }

    /**
     * Función update
     * Actualiza un arquitecto mediante su ID.
     * @param {number} id - ID del arquitecto
     * @param {Object} data - Datos del arquitecto
     * @returns {Promise<boolean>} true si se actualizó correctamente
     */
    static async update(id, data) {
        const { error } = await supabase
            .from("architects")
            .update(data)
            .eq("id_architect", id);

        if (error) throw error;
        return true;
    }

    /**
     * Función delete
     * Elimina un arquitecto mediante su ID.
     * @param {number} id - ID del arquitecto
     * @returns {Promise<boolean>} true si se eliminó correctamente
     */
    static async delete(id) {
        const { error } = await supabase
            .from("architects")
            .delete()
            .eq("id_architect", id);

        if (error) throw error;
        return true;
    }
}