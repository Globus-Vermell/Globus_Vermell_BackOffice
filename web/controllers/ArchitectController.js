import { ArchitectModel } from "../models/ArchitectModel.js";

export class ArchitectController {

    static async index(req, res) {
        try {
            const page = parseInt(req.query.page) || 1;
            const limit = parseInt(req.query.limit) || 15;

            const result = await ArchitectModel.getAll(page, limit);

            res.render("architects/architects", {
                architects: result.data,
                pagination: result
            });
        } catch (error) {
            console.error("Error al obtener arquitectos:", error);
            res.status(500).send("Error al obtenir arquitectes");
        }
    }

    static async formCreate(req, res) {
        res.render("architects/architectsForm");
    }
    static async create(req, res) {
        const { name, description, birth_year, death_year, nationality } = req.body;

        if (!name) {
            return res.status(400).json({ success: false, message: "El nom és obligatori" });
        }

        try {
            await ArchitectModel.create({
                name,
                description: description || null,
                birth_year: birth_year || null,
                death_year: death_year || null,
                nationality: nationality || null
            });

            return res.json({ success: true, message: "Arquitecte guardat correctament!" });
        } catch (err) {
            console.error("Error creando arquitecto:", err);
            return res.status(500).json({ success: false, message: "Error intern del servidor" });
        }
    }

    static async formEdit(req, res) {
        const id = Number(req.params.id);
        try {
            const architect = await ArchitectModel.getById(id);
            if (!architect) {
                return res.status(404).send("Arquitecte no trobat");
            }
            res.render("architects/architectsEdit", { architect });
        } catch (error) {
            console.error("Error obteniendo arquitecto:", error);
            return res.status(500).send("Error intern del servidor");
        }
    }

    static async update(req, res) {
        const id = Number(req.params.id);
        const { name, description, birth_year, death_year, nationality } = req.body;

        try {
            await ArchitectModel.update(id, {
                name,
                description: description || null,
                birth_year: birth_year || null,
                death_year: death_year || null,
                nationality: nationality || null
            });

            return res.json({ success: true, message: "Arquitecte actualitzat correctament!" });
        } catch (err) {
            console.error("Error actualizando:", err);
            return res.status(500).json({ success: false, message: "Error intern del servidor" });
        }
    }

    static async delete(req, res) {
        const id = Number(req.params.id);
        try {
            await ArchitectModel.delete(id);
            return res.json({ success: true, message: "Arquitecte eliminat correctament!" });
        } catch (error) {
            console.error("Error eliminando:", error);
            return res.status(500).json({ success: false, message: "Error al eliminar." });
        }
    }
}