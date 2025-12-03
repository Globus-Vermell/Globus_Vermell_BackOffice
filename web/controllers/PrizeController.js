import { PrizeModel } from "../models/PrizeModel.js";

export class PrizeController {
    static async index(req, res) {
        try {
            const prizes = await PrizeModel.getAll();
            res.render("prizes/prizes", { prizes });
        } catch (error) {
            res.status(500).send("Error al obtenir premis");
        }
    }

    static async formCreate(req, res) {
        res.render("prizes/prizesForm");
    }

    static async create(req, res) {
        const { name, tipe, year, description } = req.body;

        if (!name) {
            return res.status(400).json({ success: false, message: "El nom és obligatori" });
        }
        try {
            await PrizeModel.create({
                name,
                tipe,
                year: parseInt(year),
                description
            });

            return res.json({ success: true, message: "Premi guardat correctament!" });
        } catch (err) {
            return res.status(500).json({ success: false, message: "Error intern del servidor" });
        }
    }

    static async formEdit(req, res) {
        const id = Number(req.params.id);
        try {
            const prize = await PrizeModel.getById(id);
            res.render('prizes/prizesEdit', { prize });
        } catch (error) {
            return res.status(404).send('Premi no trobat');
        }
    }

    static async update(req, res) {
        const id = Number(req.params.id);
        const { name, tipe, year, description } = req.body;

        try {
            await PrizeModel.update(id, {
                name,
                tipe,
                year: year ? parseInt(year) : null,
                description
            });

            res.json({ success: true, message: 'Premi actualitzat correctament!' });
        } catch (err) {
            res.status(500).json({ success: false, message: 'Error intern del servidor' });
        }
    }

    static async delete(req, res) {
        const id = Number(req.params.id);
        try {
            await PrizeModel.delete(id);
            return res.json({ success: true, message: "Premi eliminat correctament!" });
        } catch (error) {
            return res.status(500).json({ success: false, message: "Error al eliminar." });
        }
    }
}