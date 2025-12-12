import { ArchitectModel } from "../models/ArchitectModel.js";
import { AppError } from "../utils/AppError.js";

export class ArchitectService {

    static async getAllArchitects(query) {
        const page = parseInt(query.page) || 1;
        const limit = parseInt(query.limit) || 15;
        const filters = { search: query.search || '' };

        const result = await ArchitectModel.getAll(page, limit, filters);

        return {
            architects: result.data,
            pagination: result,
            currentFilters: filters
        };
    }

    static async getArchitectById(id) {
        const architect = await ArchitectModel.getById(id);
        if (!architect) {
            throw new AppError("Arquitecte no trobat", 404);
        }
        return architect;
    }

    static async createArchitect(data) {
        const { name, description, birth_year, death_year, nationality } = data;

        if (!name) {
            throw new AppError("El nom és obligatori", 400);
        }

        return await ArchitectModel.create({
            name,
            description: description || null,
            birth_year: birth_year || null,
            death_year: death_year || null,
            nationality: nationality || null
        });
    }

    static async updateArchitect(id, data) {
        const { name, description, birth_year, death_year, nationality } = data;

        return await ArchitectModel.update(id, {
            name,
            description: description || null,
            birth_year: birth_year || null,
            death_year: death_year || null,
            nationality: nationality || null
        });
    }

    static async deleteArchitect(id) {
        return await ArchitectModel.delete(id);
    }
}