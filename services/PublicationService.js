import { PublicationModel } from "../models/PublicationModel.js";
import { TypologyModel } from "../models/TypologyModel.js";
import { AppError } from "../utils/AppError.js";

export class PublicationService {

    static async getAllPublications(query) {
        const page = parseInt(query.page) || 1;
        const limit = 15;

        const filters = {
            search: query.search || '',
            validated: query.validated || 'all'
        };

        const result = await PublicationModel.getAll(page, limit, filters);

        return {
            publications: result.data,
            pagination: result,
            currentFilters: filters
        };
    }

    static async getPublicationDataForEdit(id) {
        const publication = await PublicationModel.getById(id);
        if (!publication) {
            throw new AppError('Publicació no trobada', 404);
        }

        const currentTypologies = await PublicationModel.getTypologiesByPublication(id);

        return { publication, currentTypologies };
    }

    static async getAllTypologies() {
        return await TypologyModel.getAll();
    }

    static async createPublication(data) {
        const { title, description, themes, acknowledgment, publication_edition, selectedTypologies } = data;

        if (!title || !themes || !publication_edition) {
            throw new AppError("Els camps title, themes i publication_edition són obligatoris.", 400);
        }

        const pubData = {
            title,
            description,
            themes,
            acknowledgment,
            publication_edition
        };

        const typeIds = selectedTypologies
            ? (Array.isArray(selectedTypologies) ? selectedTypologies : [selectedTypologies])
            : [];

        return await PublicationModel.create(pubData, typeIds);
    }

    static async updatePublication(id, data) {
        const { title, description, themes, acknowledgment, publication_edition, selectedTypologies } = data;

        const pubData = {
            title,
            description,
            themes,
            acknowledgment,
            publication_edition
        };

        const typeIds = selectedTypologies
            ? (Array.isArray(selectedTypologies) ? selectedTypologies : [])
            : [];

        return await PublicationModel.update(id, pubData, typeIds);
    }

    static async deletePublication(id) {
        return await PublicationModel.delete(id);
    }

    static async validatePublication(id, validated) {
        return await PublicationModel.updateValidation(id, validated);
    }
}