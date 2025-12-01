import supabase from "../config.js";

//Modelo de premios
export class PrizeModel {
    //Metodo para obtener todos los premios
    static async getAll() {
        const { data, error } = await supabase
            .from("prizes")
            .select("*")
            .order("name");

        if (error) throw error;
        return data;
    }

    //Metodo para obtener un premio por ID
    static async getById(id) {
        const { data, error } = await supabase
            .from("prizes")
            .select("*")
            .eq("id_prize", id)
            .single();

        if (error) throw error;
        return data;
    }

    //Metodo para crear un premio
    static async create(data) {
        const { error } = await supabase
            .from("prizes")
            .insert([data]);

        if (error) throw error;
        return true;
    }

    //Metodo para actualizar un premio
    static async update(id, data) {
        const { error } = await supabase
            .from("prizes")
            .update(data)
            .eq("id_prize", id);

        if (error) throw error;
        return true;
    }

    //Metodo para eliminar un premio
    static async delete(id) {
        const { error } = await supabase
            .from("prizes")
            .delete()
            .eq("id_prize", id);

        if (error) throw error;
        return true;
    }
}