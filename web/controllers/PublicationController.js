import { PublicationModel } from "../models/PublicationModel.js";
import { TypologyModel } from "../models/TypologyModel.js";
export class PublicationController {

    static async index(req, res) {
        try {
            const page = parseInt(req.query.page) || 1;
            const limit = 15;
            
            // Recogemos filtros
            const filters = {
                search: req.query.search || '',
                validated: req.query.validated || 'all'
            };

            const result = await PublicationModel.getAll(page, limit, filters);

            res.render("publications/publications", {
                publications: result.data,
                pagination: result,
                currentFilters: filters
            });
        } catch (error) {
            console.error("Error:", error);
            res.status(500).send("Error a l'obtenir publicacions");
        }
    }

    static async formEdit(req, res) {
        const id = Number(req.params.id);

        try {
            const publication = await PublicationModel.getById(id);
            if (!publication) {
                return res.status(404).send('Publicació no trobada');
            }

            const allTypologies = await TypologyModel.getAll();
            const currentTypologies = await PublicationModel.getTypologiesByPublication(id);

            res.render('publications/publicationsEdit', {
                publication,
                typologies: allTypologies || [],
                currentTypologies
            });

        } catch (err) {
            console.error('Error fetching data:', err);
            return res.status(500).send('Error intern del servidor');
        }
    }

    static async update(req, res) {
        const id = Number(req.params.id);
        const { title, description, themes, acknowledgment, publication_edition, selectedTypologies } = req.body;

        try {
            const pubData = {
                title,
                description,
                themes,
                acknowledgment,
                publication_edition
            };
            const typeIds = selectedTypologies ? (Array.isArray(selectedTypologies) ? selectedTypologies : [selectedTypologies]) : [];

            await PublicationModel.update(id, pubData, typeIds);

            res.json({ success: true, message: 'Publicació actualitzada correctament!' });
        } catch (err) {
            console.error(err);
            res.status(500).json({ success: false, message: 'Error intern del servidor' });
        }
    }

    static async formCreate(req, res) {
        try {
            const allTypologies = await TypologyModel.getAll();
            res.render('publications/publicationsForm', {
                typologies: allTypologies || []
            });
        } catch (err) {
            console.error('Error fetching data:', err);
            return res.status(500).send('Error intern del servidor');
        }
    }

    static async create(req, res) {
        const { title, description, themes, acknowledgment, publication_edition, selectedTypologies } = req.body;

        if (!title || !themes || !publication_edition) {
            return res.status(400).json({
                success: false,
                message: "Els camps title, themes i publication_edition són obligatoris."
            });
        }

        try {
            const pubData = {
                title,
                description,
                themes,
                acknowledgment,
                publication_edition
            };
            const typeIds = selectedTypologies ? (Array.isArray(selectedTypologies) ? selectedTypologies : [selectedTypologies]) : [];

            await PublicationModel.create(pubData, typeIds);

            res.json({ success: true, message: 'Publicació creada correctament!' });
        } catch (err) {
            console.error(err);
            res.status(500).json({ success: false, message: 'Error intern del servidor' });
        }
    }

    static async delete(req, res) {
        const id = Number(req.params.id);

        try {
            await PublicationModel.delete(id);
            return res.json({ success: true, message: "Publicación eliminada correctament!" });
        } catch (error) {
            console.error("Error borrando:", error);
            return res.status(500).json({ success: false, message: "Error al borrar." });
        }
    }

    static async validation(req, res) {
        const id = Number(req.params.id);
        const { validated } = req.body;

        try {
            await PublicationModel.updateValidation(id, validated);
            res.json({ success: true, message: 'Estat de validació actualitzat correctament!' });
        } catch (err) {
            console.error(err);
            res.status(500).json({ success: false, message: 'Error intern del servidor' });
        }
    }
}
