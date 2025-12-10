import { BuildingModel } from "../models/BuildingModel.js";
import { PublicationModel } from "../models/PublicationModel.js";
import { AppError } from "../utils/AppError.js";

export class BuildingService {

    static async getAllBuildings(query) {
        const page = parseInt(query.page) || 1;
        const limit = 15;

        const filters = {
            search: query.search || '',
            validated: query.validated || 'all',
            publication: query.publication || 'all',
            image: query.image || 'all'
        };

        const [buildingsResult, publicationsResult] = await Promise.all([
            BuildingModel.getAll(page, limit, filters),
            PublicationModel.getAll(null, null)
        ]);

        return {
            buildings: buildingsResult.data,
            pagination: buildingsResult,
            publications: publicationsResult.data,
            currentFilters: filters
        };
    }

    static async getBuildingById(id) {
        const building = await BuildingModel.getById(id);
        if (!building) {
            throw new AppError("Edificació no trobada", 404);
        }

        const related = await BuildingModel.getRelatedData(id);
        building.buildings_descriptions = related.descriptions;

        return { building, related };
    }

    static async createBuilding(data) {
        const {
            name, address, construction_year, description, surface_area,
            publications, architects, typologies, protection,
            coordinates, pictureUrls, extra_descriptions, reforms, prizes
        } = data;

        const buildingData = {
            name,
            location: address,
            coordinates,
            construction_year: parseInt(construction_year),
            description,
            surface_area: surface_area ? parseInt(surface_area) : null,
            id_typology: parseInt(typologies),
            id_protection: protection ? parseInt(protection) : null,
        };

        const descriptionsArray = Array.isArray(extra_descriptions)
            ? extra_descriptions
            : (extra_descriptions ? [extra_descriptions] : []);

        const relations = {
            architects: Array.isArray(architects) ? architects : [],
            publications: Array.isArray(publications) ? publications : [publications],
            pictureUrls: pictureUrls || [],
            reforms: reforms ? (Array.isArray(reforms) ? reforms : [reforms]) : [],
            prizes: Array.isArray(prizes) ? prizes : (prizes ? [prizes] : [])
        };

        return await BuildingModel.create(buildingData, relations, descriptionsArray);
    }

    static async updateBuilding(id, data) {
        const {
            name, address, coordinates, construction_year, description,
            surface_area, typologies, protection,
            architects, publications, pictureUrls, extra_descriptions, reforms, prizes
        } = data;

        const buildingData = {
            name,
            location: address,
            coordinates,
            construction_year: parseInt(construction_year),
            description,
            surface_area: parseInt(surface_area),
            id_typology: parseInt(typologies),
            id_protection: parseInt(protection)
        };

        const descriptionsArray = Array.isArray(extra_descriptions)
            ? extra_descriptions
            : (extra_descriptions ? [extra_descriptions] : []);

        const relations = {
            architects: architects ? (Array.isArray(architects) ? architects : [architects]) : [],
            publications: publications ? (Array.isArray(publications) ? publications : [publications]) : [],
            pictureUrls: pictureUrls || [],
            reforms: reforms ? (Array.isArray(reforms) ? reforms : [reforms]) : [],
            prizes: prizes ? (Array.isArray(prizes) ? prizes : [prizes]) : []
        };

        return await BuildingModel.update(id, buildingData, relations, descriptionsArray);
    }

    static async deleteBuilding(id) {
        return await BuildingModel.delete(id);
    }

    static async validateBuilding(id, validated) {
        return await BuildingModel.validate(id, validated);
    }

    static async getTypologiesByPublications(idsParam) {
        if (!idsParam) return [];
        const pubIds = idsParam.split(',').map(id => parseInt(id));
        return await BuildingModel.getTypologiesByPublicationIds(pubIds);
    }

    static async uploadImages(files) {
        if (!files || files.length === 0) {
            throw new AppError("No s'ha pujat cap fitxer.", 400);
        }
        return await BuildingModel.uploadImages(files);
    }
}