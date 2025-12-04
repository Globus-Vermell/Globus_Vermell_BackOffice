import { UserModel } from "../models/UserModel.js";
import { AppError } from "../utils/AppError.js";

export class UserService {

    static async getAllUsers(query) {
        const page = parseInt(query.page) || 1;
        const limit = 15;
        const filters = { search: query.search || '' };

        const result = await UserModel.getAll(page, limit, filters);

        return {
            users: result.data,
            pagination: result,
            currentFilters: filters
        };
    }

    static async getUserById(id) {
        const user = await UserModel.getById(id);
        if (!user) {
            throw new AppError("Usuari no trobat", 404);
        }
        return user;
    }

    static async createUser(data) {
        const { name, email, password, confirmPassword, level } = data;

        if (!name || !email || !password) {
            throw new AppError("Nom, email i contrasenya són obligatoris", 400);
        }

        if (password !== confirmPassword) {
            throw new AppError("Les contrasenyes no coincideixen", 400);
        }

        return await UserModel.create({
            name,
            email,
            password,
            level
        });
    }

    static async updateUser(id, data) {
        const { name, email, password, level } = data;
        
        return await UserModel.update(id, {
            name,
            email,
            password,
            level
        });
    }

    static async deleteUser(id) {
        return await UserModel.delete(id);
    }
}