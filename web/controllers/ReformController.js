import { ReformModel } from "../models/ReformModel.js";
import { ArchitectModel } from "../models/ArchitectModel.js";

export class ReformController {
    static async index(req, res) {
        try {
            const page = parseInt(req.query.page) || 1;
            const limit = parseInt(req.query.limit) || 15;
            const result = await ReformModel.getAll(page, limit);
            const reformas = result.data;
            res.render("reform/reform", { reformas, pagination: result.pagination });
        } catch (error) {
            console.error("Error al obtener reformas:", error);
            res.status(500).send("Error al obtener reformas");
        }
    }

    static async formCreate(req, res) {
        res.render("reform/reformForm");
    }

    static async getArchitects(req, res) {
        try {
            const architects = await ArchitectModel.getAll();
            res.json(architects.data || []);
        } catch (error) {
            res.status(500).json([]);
        }
    }

    static async create(req, res) {
        const { year, id_architect } = req.body;

        if (!id_architect) {
            return res.status(400).json({ success: false, message: "L'arquitecte és obligatori" });
        }

        try {
            await ReformModel.create({
                year: parseInt(year),
                id_architect: parseInt(id_architect)
            });

            return res.json({ success: true, message: "Reforma guardada correctament!" });
        } catch (err) {
            console.error("Error:", err);
            return res.status(500).json({ success: false, message: "Error intern del servidor" });
        }
    }

    static async formEdit(req, res) {
        const id = Number(req.params.id);

        try {
            const reform = await ReformModel.getById(id);

            if (!reform) {
                return res.status(404).send('Reforma no trobada');
            }

            const architects = await ArchitectModel.getAll();

            res.render('reform/reformEdit', { reform, architects: architects.data });
        } catch (error) {
            console.error('Error fetching reform:', error);
            return res.status(500).send('Error al obtenir dades');
        }
    }

    static async update(req, res) {
        const id = Number(req.params.id);

        const { year, id_architect } = req.body;

        try {
            await ReformModel.update(id, {
                year: parseInt(year),
                id_architect: parseInt(id_architect)
            });

            res.json({ success: true, message: 'Reforma actualitzada correctament!' });
        } catch (err) {
            console.error(err);
            res.status(500).json({ success: false, message: 'Error intern del servidor' });
        }
    }

    static async delete(req, res) {
        const id = Number(req.params.id);

        try {
            await ReformModel.delete(id);
            return res.json({ success: true, message: "Reforma eliminada correctament!" });
        } catch (error) {
            console.error("Error borrando:", error);
            return res.status(500).json({ success: false, message: "Error al borrar." });
        }
    }
}
