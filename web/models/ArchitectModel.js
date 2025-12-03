import supabase from "../config.js";

// Modelo de arquitectos
export class ArchitectModel {

    // Método para obtener todos los arquitectos 
    static async getAll(page = 1, limit = 15, filters = {}) {
        let query = supabase
            .from("architects")
            .select("*", { count: 'exact' })
            .order("name");

        // Filtro de Búsqueda
        if (filters.search) {
            // Buscamos en nombre (sin importar mayúsculas/minúsculas)
            query = query.or(`name.ilike.%${filters.search}%`);
        }

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
            page: page || 1,
            limit: limit || count,
            totalPages: limit ? Math.ceil(count / limit) : 1
        };
    }

    // Método para obtener un arquitecto por ID
    static async getById(id) {
        const { data, error } = await supabase
            .from("architects")
            .select("*")
            .eq("id_architect", id)
            .single();

        if (error) throw error;
        return data;
    }

    // Método para crear un arquitecto
    static async create(data) {
        const { error } = await supabase
            .from("architects")
            .insert([data]);

        if (error) throw error;
        return true;
    }

    // Método para actualizar un arquitecto
    static async update(id, data) {
        const { error } = await supabase
            .from("architects")
            .update(data)
            .eq("id_architect", id);

        if (error) throw error;
        return true;
    }

    // Método para eliminar un arquitecto
    static async delete(id) {
        const { error } = await supabase
            .from("architects")
            .delete()
            .eq("id_architect", id);

        if (error) throw error;
        return true;
    }
}