import { ReformModel } from "../models/ReformModel.js";
import { ArchitectModel } from "../models/ArchitectModel.js";
import { AppError } from "../utils/AppError.js";

export class ReformService {

    static async getAllReforms(query) {
        const page = parseInt(query.page) || 1;
        const limit = 15;
        const filters = { search: query.search || '' };
        
        const result = await ReformModel.getAll(page, limit, filters);

        return {
            reformas: result.data,
            pagination: result,
            currentFilters: filters
        };
    }

    static async getCreateFormData() {
        const architects = await ArchitectModel.getAll(null, null);
        return { architects: architects.data || [] };
    }

    static async createReform(data) {
        const { year, id_architect } = data;

        if (!id_architect) {
            throw new AppError("L'arquitecte és obligatori", 400);
        }

        return await ReformModel.create({
            year: parseInt(year),
            id_architect: parseInt(id_architect)
        });
    }

    static async getEditFormData(id) {
        const reform = await ReformModel.getById(id);
        if (!reform) {
            throw new AppError('Reforma no trobada', 404);
        }
        const architects = await ArchitectModel.getAll(null, null);
        
        return { reform, architects: architects.data };
    }

    static async updateReform(id, data) {
        const { year, id_architect } = data;

        return await ReformModel.update(id, {
            year: parseInt(year),
            id_architect: parseInt(id_architect)
        });
    }

    static async deleteReform(id) {
        return await ReformModel.delete(id);
    }
}