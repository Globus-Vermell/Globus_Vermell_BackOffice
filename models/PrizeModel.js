import supabase from "../config.js";

/**
 * Modelo de premios
 * Maneja todas las operaciones en la base de datos relacionadas con premios.
 */
export class PrizeModel {
    /**
     * Función getAll
     * Obtiene todas los premios.
     * @param {Object} filters - Filtros de búsqueda
     * @returns {Promise<Array<Object>>} Array con los datos de los premios
     */
    static async getAll(filters = {}) {
        let query = supabase
            .from("prizes")
            .select("*")
            .order("name");

        if (filters.search) {
            query = query.or(`name.ilike.%${filters.search}%,tipe.ilike.%${filters.search}%`);
        }

        const { data, error } = await query;
        if (error) throw error;
        return data;
    }

    /**
     * Función getById
     * Obtiene un premio mediante su ID.
     * @param {number} id - ID del premio
     * @returns {Promise<Object>} Objeto con los datos del premio
     */
    static async getById(id) {
        const { data, error } = await supabase
            .from("prizes")
            .select("*")
            .eq("id_prize", id)
            .single();

        if (error) throw error;
        return data;
    }

    /**
     * Función create
     * Crea un premio.
     * @param {Object} data - Datos del premio
     * @returns {Promise<boolean>} true si se creó correctamente
     */
    static async create(data) {
        const { error } = await supabase
            .from("prizes")
            .insert([data]);

        if (error) throw error;
        return true;
    }

    /**
     * Función update
     * Actualiza un premio mediante su ID.
     * @param {number} id - ID del premio
     * @param {Object} data - Datos del premio
     * @returns {Promise<boolean>} true si se actualizó correctamente
     */
    static async update(id, data) {
        const { error } = await supabase
            .from("prizes")
            .update(data)
            .eq("id_prize", id);

        if (error) throw error;
        return true;
    }

    /**
     * Función delete
     * Elimina un premio mediante su ID.
     * @param {number} id - ID del premio
     * @returns {Promise<boolean>} true si se eliminó correctamente
     */
    static async delete(id) {
        const { error } = await supabase
            .from("prizes")
            .delete()
            .eq("id_prize", id);

        if (error) throw error;
        return true;
    }
}