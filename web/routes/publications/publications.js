import express from "express";
import { PublicationModel } from "../../models/PublicationModel.js";

// Constante y configuración del servidor Express
const router = express.Router();

// Ruta para obtener todas las publicaciones
router.get("/", async (req, res) => {
    try {
        // Obtenemos todas las publicaciones
        const page = parseInt(req.query.page) || 1;
        const limit = 15;
        const result = await PublicationModel.getAll(page, limit);

        res.render("publications/publications", {
            publications: result.data,
            pagination: result
        });
    } catch (error) {
        console.error("Error al obtener publicaciones:", error);
        return res.status(500).send("Error al obtener publicaciones");
    }
});

// Ruta para eliminar una publicación
router.delete("/delete/:id", async (req, res) => {
    // Obtenemos el id de la publicación
    const id = Number(req.params.id);

    try {
        // Borramos la publicación
        await PublicationModel.delete(id);
        return res.json({ success: true, message: "Publicación eliminada correctament!" });
    } catch (error) {
        console.error("Error borrando:", error);
        return res.status(500).json({ success: false, message: "Error al borrar." });
    }
});

// Ruta para validar una publicación
router.put('/validation/:id', async (req, res) => {
    // Obtenemos el id de la publicación
    const id = Number(req.params.id);
    // Obtenemos el estat de validació
    const { validated } = req.body;

    try {
        // Actualizamos el estat de validació
        await PublicationModel.updateValidation(id, validated);
        res.json({ success: true, message: 'Estat de validació actualitzat correctament!' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ success: false, message: 'Error intern del servidor' });
    }
});

// Exportar el router para usarlo en index.js
export default router;