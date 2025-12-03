import { BuildingModel } from "../models/BuildingModel.js";
import { PublicationModel } from "../models/PublicationModel.js";
import { ArchitectModel } from "../models/ArchitectModel.js";
import { TypologyModel } from "../models/TypologyModel.js";
import { ProtectionModel } from "../models/ProtectionModel.js";

export class BuildingController {

    static async index(req, res) {
        try {
            const page = parseInt(req.query.page) || 1;
            const limit = 15;
            
            // Recogemos TODOS los filtros
            const filters = {
                search: req.query.search || '',
                validated: req.query.validated || 'all',
                publication: req.query.publication || 'all',
                image: req.query.image || 'all'
            };

            const [buildingsResult, publicationsResult] = await Promise.all([
                BuildingModel.getAll(page, limit, filters),
                PublicationModel.getAll(null, null) // Para el desplegable
            ]);

            res.render("buildings/buildings", {
                buildings: buildingsResult.data,
                pagination: buildingsResult,
                publications: publicationsResult.data,
                currentFilters: filters // Pasamos los filtros a la vista
            });
        } catch (err) {
            res.status(500).send("Error del servidor");
        }
    }

    static async formCreate(req, res) {
        try {
            const [publications, architects, typologies, protections] = await Promise.all([
                PublicationModel.getAll(null, null),
                ArchitectModel.getAll(null, null),
                TypologyModel.getAll(),
                ProtectionModel.getAll()
            ]);

            res.render("buildings/buildingsForm", {
                publications: publications.data || [],
                architects: architects.data || [],
                typologies: typologies || [],
                protections: protections || []
            });
        } catch (error) {
            res.status(500).send("Error al cargar el formulari");
        }
    }

    static async create(req, res) {
        const {
            name, address, construction_year, description, surface_area,
            publications, architects, tipologies, protection,
            coordinates, pictureUrls
        } = req.body;

        try {
            const buildingData = {
                name,
                location: address,
                coordinates,
                construction_year: parseInt(construction_year),
                description,
                surface_area: surface_area ? parseInt(surface_area) : null,
                id_typology: parseInt(tipologies),
                id_protection: protection ? parseInt(protection) : null,
            };

            const relations = {
                architects: Array.isArray(architects) ? architects : [architects],
                publications: Array.isArray(publications) ? publications : [publications],
                pictureUrls: pictureUrls || []
            };

            await BuildingModel.create(buildingData, relations);

            res.json({ success: true, message: "Edificació guardada correctament!" });

        } catch (err) {
            res.status(500).json({ success: false, message: "Error intern del servidor" });
        }
    }

    static async formEdit(req, res) {
        const id = Number(req.params.id);

        try {
            const building = await BuildingModel.getById(id);
            if (!building) {
                return res.status(404).send("Edificació no trobada");
            }

            const related = await BuildingModel.getRelatedData(id);

            const [publications, architects, typologies, protections] = await Promise.all([
                PublicationModel.getAll(null, null),
                ArchitectModel.getAll(null, null),
                TypologyModel.getAll(),
                ProtectionModel.getAll()
            ]);

            res.render("buildings/buildingsEdit", {
                building,
                currentPublications: related.publications,
                currentArchitects: related.architects,
                imagenes: related.images,
                publications: publications.data || [],
                architects: architects.data || [],
                typologies: typologies || [],
                protections: protections || []
            });

        } catch (err) {
            res.status(500).send("Error del servidor");
        }
    }

    static async update(req, res) {
        const id = Number(req.params.id);
        const {
            name, address, coordinates, construction_year, description,
            surface_area, tipologia, id_protection,
            architects, publications, pictureUrls
        } = req.body;

        try {
            const buildingData = {
                name,
                location: address,
                coordinates,
                construction_year: parseInt(construction_year),
                description,
                surface_area: parseInt(surface_area),
                id_typology: parseInt(tipologia),
                id_protection: parseInt(id_protection)
            };

            const relations = {
                architects: architects ? (Array.isArray(architects) ? architects : [architects]) : [],
                publications: publications ? (Array.isArray(publications) ? publications : [publications]) : [],
                pictureUrls: pictureUrls || []
            };

            await BuildingModel.update(id, buildingData, relations);

            res.json({ success: true, message: "Edificació actualitzada correctament!" });

        } catch (err) {
            res.status(500).json({ success: false, message: "Error intern del servidor" });
        }
    }

    static async delete(req, res) {
        const id = Number(req.params.id);

        try {
            await BuildingModel.delete(id);
            return res.json({ success: true, message: "Edificació eliminada correctament!" });
        } catch (err) {
            return res.status(500).json({ success: false, message: "Error al borrar." });
        }
    }

    static async validate(req, res) {
        const id = Number(req.params.id);
        const { validated } = req.body;
        try {
            await BuildingModel.validate(id, validated);
            res.json({ success: true, message: 'Estat de validació actualitzat correctament!' });
        } catch (err) {
            res.status(500).json({ success: false, message: 'Error intern del servidor' });
        }
    }

    static async filterTypologies(req, res) {
        const idsParam = req.query.ids;
        if (!idsParam) return res.json([]);

        try {
            const pubIds = idsParam.split(',').map(id => parseInt(id));
            const typologies = await BuildingModel.getTypologiesByPublicationIds(pubIds);
            res.json(typologies);
        } catch (error) {
            return res.status(500).json([]);
        }
    }

    static async upload(req, res) {
        if (!req.files || req.files.length === 0) {
            return res.status(400).json({ success: false, message: "No s'ha pujat cap fitxer." });
        }

        try {
            const filePaths = await BuildingModel.uploadImages(req.files);
            res.json({ success: true, filePaths });
        } catch (err) {
            res.status(500).json({ success: false, message: "Error al pujar fitxers al núvol." });
        }
    }
}