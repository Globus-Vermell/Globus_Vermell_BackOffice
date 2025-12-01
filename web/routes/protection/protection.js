import express from "express";
import { ProtectionModel } from "../../models/ProtectionModel.js";

// Constante y configuración del servidor Express
const router = express.Router();

// Ruta para obtener todas las protecciones
router.get("/", async (req, res) => {
    try {
        // Obtenemos todas las protecciones
        const protections = await ProtectionModel.getAll();
        res.render("protection/protection", { protections });
    } catch (error) {
        res.status(500).send("Error al obtenir proteccions");
    }
});

// Ruta para eliminar una protección
router.delete("/delete/:id", async (req, res) => {
    // Obtenemos el ID de la protección
    const id = Number(req.params.id);
    try {
        // Eliminamos la protección
        await ProtectionModel.delete(id);
        return res.json({ success: true, message: "Protecció eliminada correctament!" });
    } catch (error) {
        return res.status(500).json({ success: false, message: "Error al eliminar." });
    }
});

// Exportar el router para usarlo en index.js
export default router;