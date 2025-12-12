import supabase from "../config.js";
import bcrypt from "bcrypt";
import BaseModel from "./BaseModel.js";

// Modelo de usuario
export class UserModel extends BaseModel {
    // Metodo para obtener todos los usuarios
    static async getAll(page = 1, limit = 15, filters = {}) {
        let query = supabase.from("users").select("*", { count: 'exact' }).order("name");

        if (filters.search) {
            query = query.or(`name.ilike.%${filters.search}%,email.ilike.%${filters.search}%`);
        }

        query = this.applyPagination(query, page, limit);

        const { data, count, error } = await query;

        if (error) throw error;

        return {
            data: data || [],
            ...this.getPaginationMetadata(count || 0, page, limit)
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

    // Metodo para crear un usuario
    static async create(data) {
        const hashedPassword = await bcrypt.hash(data.password, 10);
        data.password = hashedPassword;

        const { error } = await supabase.from("users").insert([data]);
        if (error) throw error;
        return true;
    }

    // Metodo para iniciar sesion
    static async login(username, plainPassword) {
        const { data: user, error } = await supabase
            .from("users")
            .select("*")
            .eq("name", username)
            .single();

        if (!user || error) return null;

        const match = await bcrypt.compare(plainPassword, user.password);

        if (match) return user;
        return null;
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