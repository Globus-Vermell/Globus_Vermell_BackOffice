import { TypologyService } from "../services/TypologyService.js";

export class TypologyController {
    
    static async index(req, res, next) {
        try {
            const typologies = await TypologyService.getAllTypologies(req.query);
            res.render("typologies/index", { 
                typologies, 
                currentFilters: { search: req.query.search || '' } 
            });
        } catch (error) {
            next(error);
        }
    }

    static async formCreate(req, res, next) {
        res.render("typologies/create");
    }

    static async create(req, res, next) {
        try {
            await TypologyService.createTypology(req.body);
            res.json({ success: true, message: "Tipologia guardada correctament!" });
        } catch (err) {
            next(err);
        }
    }

    static async formEdit(req, res, next) {
        const id = Number(req.params.id);
        try {
            const typology = await TypologyService.getTypologyById(id);
            res.render('typologies/edit', { typology });
        } catch (error) {
            next(error);
        }
    }

    static async update(req, res, next) {
        const id = Number(req.params.id);
        try {
            await TypologyService.updateTypology(id, req.body);
            res.json({ success: true, message: 'Tipologia actualitzada correctament!' });
        } catch (err) {
            next(err);
        }
    }

    static async delete(req, res, next) {
        const id = Number(req.params.id);
        try {
            await TypologyService.deleteTypology(id);
            res.json({ success: true, message: "Tipologia eliminada correctament!" });
        } catch (error) {
            next(error);
        }
    }

    static async upload(req, res, next) {
        try {
            const publicUrl = await TypologyService.uploadImage(req.file);
            res.json({ success: true, filePath: publicUrl });
        } catch (err) {
            next(err);
        }
    }
}