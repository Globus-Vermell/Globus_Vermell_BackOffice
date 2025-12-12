import supabase from "../config.js";

// Modelo de protección
export class ProtectionModel {
    // Método para obtener todas las protecciones
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

    // Método para obtener una protección por ID
    static async getById(id) {
        const { data, error } = await supabase
            .from("protection")
            .select("*")
            .eq("id_protection", id)
            .single();

        if (error) throw error;
        return data;
    }

    // Método para crear una protección
    static async create(data) {
        const { error } = await supabase
            .from("protection")
            .insert([data]);

        if (error) throw error;
        return true;
    }

    // Método para actualizar una protección
    static async update(id, data) {
        const { error } = await supabase
            .from("protection")
            .update(data)
            .eq("id_protection", id);

        if (error) throw error;
        return true;
    }

    // Método para eliminar una protección
    static async delete(id) {
        const { error } = await supabase
            .from("protection")
            .delete()
            .eq("id_protection", id);

        if (error) throw error;
        return true;
    }
}