import { PrizeModel } from "../models/PrizeModel.js";
import { AppError } from "../utils/AppError.js";

export class PrizeService {

    static async getAllPrizes(query) {
        const filters = { search: query.search || '' };
        return await PrizeModel.getAll(filters);
    }

    static async getPrizeById(id) {
        const prize = await PrizeModel.getById(id);
        if (!prize) {
            throw new AppError("Premi no trobat", 404);
        }
        return prize;
    }

    static async createPrize(data) {
        const { name, tipe, year, description } = data; 

        if (!name) {
            throw new AppError("El nom és obligatori", 400);
        }

        return await PrizeModel.create({
            name,
            tipe, 
            year: year ? parseInt(year) : null,
            description
        });
    }

    static async updatePrize(id, data) {
        const { name, tipe, year, description } = data;

        return await PrizeModel.update(id, {
            name,
            tipe,
            year: year ? parseInt(year) : null,
            description
        });
    }

    static async deletePrize(id) {
        return await PrizeModel.delete(id);
    }
}