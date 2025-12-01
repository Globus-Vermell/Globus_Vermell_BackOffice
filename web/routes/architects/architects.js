import express from "express";
import { ArchitectModel } from "../../models/ArchitectModel.js";

// Constante y configuración del servidor Express
const router = express.Router();

// Ruta para obtener todos los arquitectos
router.get("/", async (req, res) => {
    try {
        // Obtenemos todos los arquitectos
        const architects = await ArchitectModel.getAll();
        res.render("architects/architects", { architects });
    } catch (error) {
        res.status(500).send("Error al obtenir arquitectes");
    }
});

// Ruta para eliminar un arquitecto
router.delete("/delete/:id", async (req, res) => {
    // Obtenemos el ID del arquitecto
    const id = Number(req.params.id);
    try {
        // Eliminamos el arquitecto
        await ArchitectModel.delete(id);
        return res.json({ success: true, message: "Arquitecte eliminat correctament!" });
    } catch (error) {
        return res.status(500).json({ success: false, message: "Error al eliminar." });
    }
});

// Exportamos el router para usarlo en index.js
export default router;