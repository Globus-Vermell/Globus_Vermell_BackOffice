import { ReformService } from "../services/ReformService.js";

export class ReformController {
    
    static async index(req, res, next) {
        try {
            const data = await ReformService.getAllReforms(req.query);
            res.render("reforms/index", data);
        } catch (error) {
            next(error);
        }
    }

    static async formCreate(req, res, next) {
        try {
            const data = await ReformService.getCreateFormData();
            res.render("reforms/create", data);
        } catch (error) {
            next(error);
        }
    }

    static async create(req, res, next) {
        try {
            await ReformService.createReform(req.body);
            res.json({ success: true, message: "Reforma guardada correctament!" });
        } catch (err) {
            next(err);
        }
    }

    static async formEdit(req, res, next) {
        const id = Number(req.params.id);
        try {
            const data = await ReformService.getEditFormData(id);
            res.render('reforms/edit', data);
        } catch (error) {
            next(error);
        }
    }

    static async update(req, res, next) {
        const id = Number(req.params.id);
        try {
            await ReformService.updateReform(id, req.body);
            res.json({ success: true, message: 'Reforma actualitzada correctament!' });
        } catch (err) {
            next(err);
        }
    }

    static async delete(req, res, next) {
        const id = Number(req.params.id);
        try {
            await ReformService.deleteReform(id);
            res.json({ success: true, message: "Reforma eliminada correctament!" });
        } catch (error) {
            next(error);
        }
    }
}