import { TypologyModel } from "../models/TypologyModel.js";
import supabase from "../config.js"; 
import { AppError } from "../utils/AppError.js";

export class TypologyService {

    static async getAllTypologies(query) {
        const filters = { search: query.search || '' };
        return await TypologyModel.getAll(filters);
    }

    static async getTypologyById(id) {
        const typology = await TypologyModel.getById(id);
        if (!typology) {
            throw new AppError("Tipologia no trobada", 404);
        }
        return typology;
    }

    static async createTypology(data) {
        const { name, image } = data;

        if (!name) {
            throw new AppError("El nom és obligatori", 400);
        }

        return await TypologyModel.create({ name, image });
    }

    static async updateTypology(id, data) {
        const { name, image } = data;
        return await TypologyModel.update(id, { name, image });
    }

    static async deleteTypology(id) {
        return await TypologyModel.delete(id);
    }

    static async uploadImage(file) {
        if (!file) {
            throw new AppError("No s'ha pujat cap fitxer.", 400);
        }

        const cleanName = file.originalname.replace(/[^a-zA-Z0-9.]/g, '_');
        const fileName = `${Date.now()}_${cleanName}`;

        const { error } = await supabase.storage
            .from('images')
            .upload(`typologies/${fileName}`, file.buffer, {
                contentType: file.mimetype
            });

        if (error) throw error;

        const { data } = supabase.storage
            .from('images')
            .getPublicUrl(`typologies/${fileName}`);

        return data.publicUrl;
    }
}