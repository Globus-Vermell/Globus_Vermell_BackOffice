import express from "express";
import { BuildingModel } from "../../models/BuildingModel.js";
import { PublicationModel } from "../../models/PublicationModel.js";

// Constante y configuración del servidor Express
const router = express.Router();

// Ruta para obtener todas las construcciones
router.get("/", async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = 15;
        
        // Recogemos todos los posibles filtros
         const filters = {
            search: req.query.search || '',
            validated: req.query.validated || 'all',
            publication: req.query.publication || 'all'
        }; 

        const [buildingsResult, publicationsResult] = await Promise.all([
            BuildingModel.getAll(page, limit, filters),
            PublicationModel.getAll()
        ]);

        res.render("buildings/buildings", {
            buildings: buildingsResult.data,
            pagination: buildingsResult,
            publications: publicationsResult.data,
            currentFilters: filters // ¡Pasamos los filtros a la vista!
        });
    } catch (err) {
        console.error("Error inesperado:", err);
        res.status(500).send("Error del servidor");
    }
});

// Ruta para eliminar una construcción
router.delete("/delete/:id", async (req, res) => {
    // Recogemos el ID de la construcción
    const id = Number(req.params.id);

    try {
        // Borrado de la construcción
        await BuildingModel.delete(id);
        return res.json({ success: true, message: "Edificació eliminada correctament!" });
    } catch (err) {
        console.error("Error borrando:", err);
        return res.status(500).json({ success: false, message: "Error al borrar." });
    }
});

// Ruta para validar una edificación
router.put('/validation/:id', async (req, res) => {
    // Recogemos el ID de la construcción
    const id = Number(req.params.id);
    // Recogemos el estado de validación
    const { validated } = req.body;
    try {
        // Actualización del estado de validación
        await BuildingModel.validate(id, validated);
        res.json({ success: true, message: 'Estat de validació actualitzat correctament!' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ success: false, message: 'Error intern del servidor' });
    }
});

// Exportar el router para usarlo en index.js
export default router;