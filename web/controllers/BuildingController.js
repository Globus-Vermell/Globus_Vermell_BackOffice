import { BuildingService } from "../services/BuildingService.js";
import { PublicationModel } from "../models/PublicationModel.js";
import { ArchitectModel } from "../models/ArchitectModel.js";
import { TypologyModel } from "../models/TypologyModel.js";
import { ProtectionModel } from "../models/ProtectionModel.js";
import { ReformModel } from "../models/ReformModel.js";

export class BuildingController {

    static async index(req, res, next) {
        try {
            const data = await BuildingService.getAllBuildings(req.query);
            res.render("buildings/index", data);
        } catch (err) {
            next(err);
        }
    }

    static async formCreate(req, res, next) {
        try {
            const [publications, architects, typologies, protections, reforms] = await Promise.all([
                PublicationModel.getAll(null, null),
                ArchitectModel.getAll(null, null),
                TypologyModel.getAll(),
                ProtectionModel.getAll(),
                ReformModel.getAll(null, null)
            ]);

            res.render("buildings/create", {
                publications: publications.data || [],
                architects: architects.data || [],
                typologies: typologies || [],
                protections: protections || [],
                reforms: reforms || []
            });
        } catch (error) {
            next(error);
        }
    }

    static async create(req, res, next) {
        try {
            await BuildingService.createBuilding(req.body);
            res.json({ success: true, message: "Edificació guardada correctament!" });
        } catch (err) {
            next(err);
        }
    }

    static async formEdit(req, res, next) {
        const id = Number(req.params.id);
        try {
            const { building, related } = await BuildingService.getBuildingById(id);

            const [publications, architects, typologies, protections, reforms] = await Promise.all([
                PublicationModel.getAll(null, null),
                ArchitectModel.getAll(null, null),
                TypologyModel.getAll(),
                ProtectionModel.getAll(),
                ReformModel.getAll(null, null)
            ]);

            res.render("buildings/edit", {
                building,
                currentPublications: related.publications,
                currentArchitects: related.architects,
                imagenes: related.images,
                publications: publications.data || [],
                architects: architects.data || [],
                typologies: typologies || [],
                protections: protections || [],
                reforms: reforms || []
            });
        } catch (err) {
            next(err);
        }
    }

    static async update(req, res, next) {
        const id = Number(req.params.id);
        try {
            await BuildingService.updateBuilding(id, req.body);
            res.json({ success: true, message: "Edificació actualitzada correctament!" });
        } catch (err) {
            next(err);
        }
    }

    static async delete(req, res, next) {
        const id = Number(req.params.id);
        try {
            await BuildingService.deleteBuilding(id);
            return res.json({ success: true, message: "Edificació eliminada correctament!" });
        } catch (err) {
            next(err);
        }
    }

    static async validate(req, res, next) {
        const id = Number(req.params.id);
        const { validated } = req.body;
        try {
            await BuildingService.validateBuilding(id, validated);
            res.json({ success: true, message: 'Estat de validació actualitzat correctament!' });
        } catch (err) {
            next(err);
        }
    }

    static async filterTypologies(req, res, next) {
        try {
            const typologies = await BuildingService.getTypologiesByPublications(req.query.ids);
            res.json(typologies);
        } catch (error) {
            next(error);
        }
    }

    static async upload(req, res, next) {
        try {
            const filePaths = await BuildingService.uploadImages(req.files);
            res.json({ success: true, filePaths });
        } catch (err) {
            next(err);
        }
    }
}