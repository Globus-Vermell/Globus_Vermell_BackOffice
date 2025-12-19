import supabase from "../config.js";
import bcrypt from "bcrypt";
import BaseModel from "./BaseModel.js";

/**
 * Modelo de usuario
 * Maneja todas las operaciones en la base de datos relacionadas con usuarios.
 */
export class UserModel extends BaseModel {
    /**
     * Función getAll
     * Obtiene todos los usuarios
     * @param {number} page - Número de página
     * @param {number} limit - Límite de registros por página
     * @param {Object} filters - Filtros de búsqueda
     * @returns {Promise<Object>} Objeto con los datos de los usuarios y metadatos de paginación
     */
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

    /**
     * Función getById
     * Obtiene un usuario por su id
     * @param {number} id - ID del usuario
     * @returns {Promise<Object>} Objeto con los datos del usuario
     */
    static async getById(id) {
        const { data, error } = await supabase
            .from("users")
            .select("*")
            .eq("id_user", id)
            .single();

        if (error) throw error;
        return data;
    }

    /**
     * Función create
     * Crea un usuario.
     * @param {Object} data - Datos del usuario
     * @returns {Promise<boolean>} true si se creó correctamente
     */
    static async create(data) {
        const hashedPassword = await bcrypt.hash(data.password, 10);
        data.password = hashedPassword;

        const { error } = await supabase.from("users").insert([data]);
        if (error) throw error;
        return true;
    }

    /**
     * Función login
     * Inicia sesión con un usuario.
     * @param {string} username - Nombre de usuario
     * @param {string} plainPassword - Contraseña sin encriptar
     * @returns {Promise<Object|null>} Objeto con los datos del usuario si se autenticó correctamente, null si no se autenticó
     */
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

    /**
     * Función update
     * Actualiza un usuario mediante su ID.
     * @param {number} id - ID del usuario
     * @param {Object} data - Datos del usuario
     * @returns {Promise<boolean>} true si se actualizó correctamente
     */
    static async update(id, data) {
        const { error } = await supabase
            .from("users")
            .update(data)
            .eq("id_user", id);

        if (error) throw error;
        return true;
    }

    /**
     * Función delete
     * Elimina un usuario mediante su ID.
     * @param {number} id - ID del usuario
     * @returns {Promise<boolean>} true si se eliminó correctamente
     */
    static async delete(id) {
        const { error } = await supabase
            .from("users")
            .delete()
            .eq("id_user", id);

        if (error) throw error;
        return true;
    }
}