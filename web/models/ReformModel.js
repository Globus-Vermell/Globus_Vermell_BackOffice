import supabase from "../config.js";

// Modelo de reformas
export class ReformModel {
    // Método para obtener todas las reformas
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
            totalPages: limit ? Math.ceil(count / limit) : 1
        };
    }

    // Método para obtener una reforma por ID
    static async getById(id) {
        const { data, error } = await supabase
            .from("reform")
            .select("*")
            .eq("id_reform", id)
            .single();

        if (error) throw error;
        return data;
    }

    // Método para crear una reforma
    static async create(data) {
        const { error } = await supabase
            .from("reform")
            .insert([data]);

        if (error) throw error;
        return true;
    }

    // Método para actualizar una reforma
    static async update(id, data) {
        const { error } = await supabase
            .from("reform")
            .update(data)
            .eq("id_reform", id);

        if (error) throw error;
        return true;
    }

    // Método para eliminar una reforma
    static async delete(id) {
        const { error } = await supabase
            .from("reform")
            .delete()
            .eq("id_reform", id);

        if (error) throw error;
        return true;
    }
}