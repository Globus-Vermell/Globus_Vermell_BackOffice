import supabase from "../config.js";

/**
 * Modelo de protección
 * Maneja todas las operaciones en la base de datos relacionadas con protección.
 */
export class ProtectionModel {
    /**
     * Función getAll
     * Obtiene todas las protecciones.
     * @param {Object} filters - Filtros de búsqueda
     * @returns {Promise<Array<Object>>} Array con los datos de las protecciones
     */
    static async getAll(filters = {}) {
        let query = supabase
            .from("protection")
            .select("*")
            .order("level");

        if (filters.search) {
            query = query.or(`level.ilike.%${filters.search}%`);
        }

        const { data, error } = await query;
        if (error) throw error;
        return data;
    }

    /**
     * Función getById
     * Obtiene una protección mediante su ID.
     * @param {number} id - ID de la protección
     * @returns {Promise<Object>} Objeto con los datos de la protección
     */
    static async getById(id) {
        const { data, error } = await supabase
            .from("protection")
            .select("*")
            .eq("id_protection", id)
            .single();

        if (error) throw error;
        return data;
    }

    /**
     * Función create
     * Crea una protección.
     * @param {Object} data - Datos de la protección
     * @returns {Promise<boolean>} true si se creó correctamente
     */
    static async create(data) {
        const { error } = await supabase
            .from("protection")
            .insert([data]);

        if (error) throw error;
        return true;
    }

    /**
     * Función update
     * Actualiza una protección mediante su ID.
     * @param {number} id - ID de la protección
     * @param {Object} data - Datos de la protección
     * @returns {Promise<boolean>} true si se actualizó correctamente
     */
    static async update(id, data) {
        const { error } = await supabase
            .from("protection")
            .update(data)
            .eq("id_protection", id);

        if (error) throw error;
        return true;
    }

    /**
     * Función delete
     * Elimina una protección mediante su ID.
     * @param {number} id - ID de la protección
     * @returns {Promise<boolean>} true si se eliminó correctamente
     */
    static async delete(id) {
        const { error } = await supabase
            .from("protection")
            .delete()
            .eq("id_protection", id);

        if (error) throw error;
        return true;
    }
}