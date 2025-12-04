import { PublicationService } from "../services/PublicationService.js";

export class PublicationController {

    static async index(req, res, next) {
        try {
            const data = await PublicationService.getAllPublications(req.query);
            res.render("publications/index", data);
        } catch (error) {
            next(error);
        }
    }

    static async formCreate(req, res, next) {
        try {
            const typologies = await PublicationService.getAllTypologies();
            res.render('publications/create', {
                typologies: typologies || []
            });
        } catch (err) {
            next(err);
        }
    }

    static async create(req, res, next) {
        try {
            await PublicationService.createPublication(req.body);
            res.json({ success: true, message: 'Publicació creada correctament!' });
        } catch (err) {
            next(err);
        }
    }

    static async formEdit(req, res, next) {
        const id = Number(req.params.id);
        try {
            const [data, typologies] = await Promise.all([
                PublicationService.getPublicationDataForEdit(id),
                PublicationService.getAllTypologies()
            ]);

            res.render('publications/edit', {
                publication: data.publication,
                currentTypologies: data.currentTypologies,
                typologies: typologies || []
            });

        } catch (err) {
            next(err);
        }
    }

    static async update(req, res, next) {
        const id = Number(req.params.id);
        try {
            await PublicationService.updatePublication(id, req.body);
            res.json({ success: true, message: 'Publicació actualitzada correctament!' });
        } catch (err) {
            next(err);
        }
    }

    static async delete(req, res, next) {
        const id = Number(req.params.id);
        try {
            await PublicationService.deletePublication(id);
            return res.json({ success: true, message: "Publicació eliminada correctament!" });
        } catch (error) {
            next(error);
        }
    }

    static async validation(req, res, next) {
        const id = Number(req.params.id);
        const { validated } = req.body;
        try {
            await PublicationService.validatePublication(id, validated);
            res.json({ success: true, message: 'Estat de validació actualitzat correctament!' });
        } catch (err) {
            next(err);
        }
    }
}