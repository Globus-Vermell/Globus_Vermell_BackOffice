import supabase from "../config.js";

// Modelo de tipología
export class TypologyModel {
    // Método para obtener todas las tipologías
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

    // Método para obtener una tipología por ID
    static async getById(id) {
        const { data, error } = await supabase
            .from("typology")
            .select("*")
            .eq("id_typology", id)
            .single();

        if (error) throw error;
        return data;
    }

    // Método para crear una tipología
    static async create(data) {
        const { error } = await supabase
            .from("typology")
            .insert([data]);

        if (error) throw error;
        return true;
    }

    // Método para actualizar una tipología
    static async update(id, data) {
        const { error } = await supabase
            .from("typology")
            .update(data)
            .eq("id_typology", id);

        if (error) throw error;
        return true;
    }

    // Método para eliminar una tipología
    static async delete(id) {
        // Buscar la tipología por ID para obtener su imagen
        const { data: typology, error: findError } = await supabase
            .from("typology")
            .select("image")
            .eq("id_typology", id)
            .single();

        if (findError) throw findError;

        // Si tiene imagen, borrarla del Storage
        if (typology.image) {
            // Extraer la ruta relativa de la imagen
            const pathParts = typology.image.split('/images/');
            if (pathParts.length > 1) {
                // Borrar la imagen del Storage
                const relativePath = pathParts[1];
                await supabase.storage.from('images').remove([relativePath]);
            }
        }

        // Borrar la tipología de la BDD
        const { error } = await supabase
            .from("typology")
            .delete()
            .eq("id_typology", id);

        if (error) throw error;
        return true;
    }
}