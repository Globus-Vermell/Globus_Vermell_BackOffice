import supabase from "../config.js";

/**
 * Modelo de tipología
 * Maneja todas las operaciones en la base de datos relacionadas con tipologías.
 */
export class TypologyModel {
    /**
     * Función getAll
     * Obtiene todas las tipologías.
     * @param {Object} filters - Filtros de búsqueda
     * @returns {Promise<Object>} Objeto con los datos de las tipologías
     */
    static async getAll(filters = {}) {
        let query = supabase
            .from("typology")
            .select("*")
            .order("name");

        if (filters.search) {
            query = query.ilike('name', `%${filters.search}%`);
        }

        const { data, error } = await query;
        if (error) throw error;
        return data;
    }

    /**
     * Función getById
     * Obtiene una tipología mediante su ID.
     * @param {number} id - ID de la tipología
     * @returns {Promise<Object>} Objeto con los datos de la tipología
     */
    static async getById(id) {
        const { data, error } = await supabase
            .from("typology")
            .select("*")
            .eq("id_typology", id)
            .single();

        if (error) throw error;
        return data;
    }

    /**
     * Función create
     * Crea una tipología.
     * @param {Object} data - Datos de la tipología
     * @returns {Promise<boolean>} true si se creó correctamente
     */
    static async create(data) {
        const { error } = await supabase
            .from("typology")
            .insert([data]);

        if (error) throw error;
        return true;
    }

    /**
     * Función update
     * Actualiza una tipología mediante su ID.
     * @param {number} id - ID de la tipología
     * @param {Object} data - Datos de la tipología
     * @returns {Promise<boolean>} true si se actualizó correctamente
     */
    static async update(id, data) {
        const { error } = await supabase
            .from("typology")
            .update(data)
            .eq("id_typology", id);

        if (error) throw error;
        return true;
    }

    /**
     * Función delete
     * Elimina una tipología mediante su ID.
     * @param {number} id - ID de la tipología
     * @returns {Promise<boolean>} true si se eliminó correctamente
     */
    static async delete(id) {
        const { data: typology, error: findError } = await supabase
            .from("typology")
            .select("image")
            .eq("id_typology", id)
            .single();

        if (findError) throw findError;

        // Si tiene imagen, borrarla del Storage
        if (typology.image) {
            const pathParts = typology.image.split('/images/');
            if (pathParts.length > 1) {
                const relativePath = pathParts[1];
                await supabase.storage.from('images').remove([relativePath]);
            }
        }

        const { error } = await supabase
            .from("typology")
            .delete()
            .eq("id_typology", id);

        if (error) throw error;
        return true;
    }
}