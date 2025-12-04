import { ProtectionService } from "../services/ProtectionService.js";

export class ProtectionController {
    
    static async index(req, res, next) {
        try {
            const protections = await ProtectionService.getAllProtections(req.query);
            res.render("protections/index", { 
                protections, 
                currentFilters: { search: req.query.search || '' } 
            });
        } catch (error) {
            next(error);
        }
    }

    static async formCreate(req, res, next) {
        res.render("protections/create");
    }

    static async create(req, res, next) {
        try {
            await ProtectionService.createProtection(req.body);
            res.json({ success: true, message: "Protecció guardada correctament!" });
        } catch (err) {
            next(err);
        }
    }

    static async formEdit(req, res, next) {
        const id = Number(req.params.id);
        try {
            const protection = await ProtectionService.getProtectionById(id);
            res.render('protections/edit', { protection });
        } catch (error) {
            next(error);
        }
    }

    static async update(req, res, next) {
        const id = Number(req.params.id);
        try {
            await ProtectionService.updateProtection(id, req.body);
            res.json({ success: true, message: 'Protecció actualitzada correctament!' });
        } catch (err) {
            next(err);
        }
    }

    static async delete(req, res, next) {
        const id = Number(req.params.id);
        try {
            await ProtectionService.deleteProtection(id);
            res.json({ success: true, message: "Protecció eliminada correctament!" });
        } catch (error) {
            next(error);
        }
    }
}