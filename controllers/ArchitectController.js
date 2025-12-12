import { ArchitectService } from "../services/ArchitectService.js";

export class ArchitectController {

    static async index(req, res, next) {
        try {
            const data = await ArchitectService.getAllArchitects(req.query);
            res.render("architects/index", data);
        } catch (error) {
            next(error);
        }
    }

    static async formCreate(req, res, next) {
        res.render("architects/create");
    }

    static async create(req, res, next) {
        try {
            await ArchitectService.createArchitect(req.body);
            res.json({ success: true, message: "Arquitecte guardat correctament!" });
        } catch (err) {
            next(err);
        }
    }

    static async formEdit(req, res, next) {
        const id = Number(req.params.id);
        try {
            const architect = await ArchitectService.getArchitectById(id);
            res.render("architects/edit", { architect });
        } catch (error) {
            next(error);
        }
    }

    static async update(req, res, next) {
        const id = Number(req.params.id);
        try {
            await ArchitectService.updateArchitect(id, req.body);
            res.json({ success: true, message: "Arquitecte actualitzat correctament!" });
        } catch (err) {
            next(err);
        }
    }

    static async delete(req, res, next) {
        const id = Number(req.params.id);
        try {
            await ArchitectService.deleteArchitect(id);
            res.json({ success: true, message: "Arquitecte eliminat correctament!" });
        } catch (error) {
            next(error);
        }
    }
}