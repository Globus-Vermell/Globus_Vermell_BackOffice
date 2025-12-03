import { TypologyModel } from "../models/TypologyModel.js";
import supabase from "../config.js";

export class TypologyController {
    static async index(req, res) {
        try {
            const typologies = await TypologyModel.getAll();
            res.render("typology/typology", { typologies });
        } catch (error) {
            res.status(500).send("Error al obtenir tipologies");
        }
    }

    static async formCreate(req, res) {
        res.render("typology/typologyForm");
    }

    static async create(req, res) {
        const { name, image } = req.body;

        if (!name) {
            return res.status(400).json({ success: false, message: "El nom és obligatori" });
        }

        try {
            await TypologyModel.create({ name, image });
            return res.json({ success: true, message: "Tipologia guardada correctament!" });
        } catch (err) {
            return res.status(500).json({ success: false, message: "Error intern del servidor" });
        }
    }

    static async formEdit(req, res) {
        const id = Number(req.params.id);
        try {
            const typology = await TypologyModel.getById(id);
            res.render('typology/typologyEdit', { typology });
        } catch (error) {
            return res.status(404).send('Tipologia no trobada');
        }
    }

    static async update(req, res) {
        const id = Number(req.params.id);
        const { name, image } = req.body;

        try {
            await TypologyModel.update(id, { name, image });
            res.json({ success: true, message: 'Tipologia actualitzada correctament!' });
        } catch (err) {
            res.status(500).json({ success: false, message: 'Error intern del servidor' });
        }
    }

    static async delete(req, res) {
        const id = Number(req.params.id);
        try {
            await TypologyModel.delete(id);
            return res.json({ success: true, message: "Tipologia eliminada correctament!" });
        } catch (error) {
            return res.status(500).json({ success: false, message: "Error al eliminar." });
        }
    }

    static async upload(req, res) {
        if (!req.file) {
            return res.status(400).json({ success: false, message: "No s'ha pujat cap fitxer." });
        }

        try {
            const cleanName = req.file.originalname.replace(/[^a-zA-Z0-9.]/g, '_');
            const fileName = `${Date.now()}_${cleanName}`;

            const { error } = await supabase.storage
                .from('images')
                .upload(`typologies/${fileName}`, req.file.buffer, {
                    contentType: req.file.mimetype
                });

            if (error) throw error;

            const { data } = supabase.storage
                .from('images')
                .getPublicUrl(`typologies/${fileName}`);

            res.json({ success: true, filePath: data.publicUrl });

        } catch (err) {
            console.error(err);
            res.status(500).json({ success: false, message: "Error al pujar la imatge." });
        }
    }
}