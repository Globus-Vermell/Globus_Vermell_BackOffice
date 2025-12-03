import { ProtectionModel } from "../models/ProtectionModel.js";

export class ProtectionController {
    static async index(req, res) {
        try {
            const filters = { search: req.query.search || '' };
            const protections = await ProtectionModel.getAll(filters);
            res.render("protection/protection", { protections, currentFilters: filters });
        } catch (error) {
            res.status(500).send("Error al obtenir proteccions");
        }
    }

    static async formCreate(req, res) {
        res.render("protection/protectionForm");
    }

    static async create(req, res) {
        const { level, description } = req.body;

        if (!level) {
            return res.status(400).json({ success: false, message: "El nivell és obligatori" });
        }

        try {
            await ProtectionModel.create({
                level,
                description
            });

            return res.json({ success: true, message: "Protecció guardada correctament!" });
        } catch (err) {
            return res.status(500).json({ success: false, message: "Error intern del servidor" });
        }
    }

    static async formEdit(req, res) {
        const id = Number(req.params.id);
        try {
            const protection = await ProtectionModel.getById(id);
            res.render('protection/protectionEdit', { protection });
        } catch (error) {
            return res.status(404).send('Protecció no trobada');
        }
    }

    static async update(req, res) {
        const id = Number(req.params.id);
        const { level, description } = req.body;
        try {
            await ProtectionModel.update(id, { level, description });
            res.json({ success: true, message: 'Protecció actualitzada correctament!' });
        } catch (err) {
            res.status(500).json({ success: false, message: 'Error intern del servidor' });
        }
    }

    static async delete(req, res) {
        const id = Number(req.params.id);
        try {
            await ProtectionModel.delete(id);
            return res.json({ success: true, message: "Protecció eliminada correctament!" });
        } catch (error) {
            return res.status(500).json({ success: false, message: "Error al eliminar." });
        }
    }
}
