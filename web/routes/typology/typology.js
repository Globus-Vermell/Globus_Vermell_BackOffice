import express from "express";
import { TypologyModel } from "../../models/TypologyModel.js";

// Constante y configuración del servidor Express
const router = express.Router();

// Ruta para obtener todas las tipologías
router.get("/", async (req, res) => {
    try {
        // Obtenemos todas las tipologías
        const typologies = await TypologyModel.getAll();
        res.render("typology/typology", { typologies });
    } catch (error) {
        res.status(500).send("Error al obtenir tipologies");
    }
});

// Ruta para eliminar una tipología
router.delete("/delete/:id", async (req, res) => {
    // Obtenemos el ID de la tipología
    const id = Number(req.params.id);
    try {
        // Eliminamos la tipología
        await TypologyModel.delete(id);
        return res.json({ success: true, message: "Tipologia eliminada correctament!" });
    } catch (error) {
        return res.status(500).json({ success: false, message: "Error al eliminar." });
    }
});

// Exportar el router para usarlo en index.js
export default router;