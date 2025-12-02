import supabase from "../config.js";

// Modelo de usuario
export class UserModel {
    // Metodo para obtener todos los usuarios
    static async getAll(page = null, limit = null) {
        let query = supabase
            .from("users")
            .select("*")
            .order("name");
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

    // Metodo para obtener un usuario por su id
    static async getById(id) {
        const { data, error } = await supabase
            .from("users")
            .select("*")
            .eq("id_user", id)
            .single();

        if (error) throw error;
        return data;
    }

    // Metodo para obtener un usuario por su nombre y contraseña
    static async getByCredentials(username, password) {
        const { data, error } = await supabase
            .from("users")
            .select("*")
            .eq("name", username)
            .eq("password", password)
            .maybeSingle();

        if (error) throw error;
        return data;
    }

    // Metodo para crear un usuario
    static async create(data) {
        const { error } = await supabase
            .from("users")
            .insert([data]);

        if (error) throw error;
        return true;
    }

    // Metodo para actualizar un usuario
    static async update(id, data) {
        const { error } = await supabase
            .from("users")
            .update(data)
            .eq("id_user", id);

        if (error) throw error;
        return true;
    }

    // Metodo para eliminar un usuario
    static async delete(id) {
        const { error } = await supabase
            .from("users")
            .delete()
            .eq("id_user", id);

        if (error) throw error;
        return true;
    }
}