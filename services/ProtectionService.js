import { ProtectionModel } from "../models/ProtectionModel.js";
import { AppError } from "../utils/AppError.js";

export class ProtectionService {

    static async getAllProtections(query) {
        const filters = { search: query.search || '' };
        return await ProtectionModel.getAll(filters);
    }

    static async getProtectionById(id) {
        const protection = await ProtectionModel.getById(id);
        if (!protection) {
            throw new AppError('Protecció no trobada', 404);
        }
        return protection;
    }

    static async createProtection(data) {
        const { level, description } = data;

        if (!level) {
            throw new AppError("El nivell és obligatori", 400);
        }

        return await ProtectionModel.create({
            level,
            description
        });
    }

    static async updateProtection(id, data) {
        const { level, description } = data;
        return await ProtectionModel.update(id, { level, description });
    }

    static async deleteProtection(id) {
        return await ProtectionModel.delete(id);
    }
}