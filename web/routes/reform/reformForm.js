import express from "express";
import { ReformModel } from "../../models/ReformModel.js";
import { ArchitectModel } from "../../models/ArchitectModel.js";

// Constante y configuración del servidor Express
const router = express.Router();

// Ruta para mostrar el formulario de nueva reforma
router.get("/", (req, res) => {
    res.render("reform/reformForm");
});

// Ruta para obtener la lista de arquitectos para el formulario
router.get("/architects", async (req, res) => {
    try {
        // Obtenemos todos los arquitectos
        const architects = await ArchitectModel.getAll();
        res.json(architects.data || []);
    } catch (error) {
        return res.status(500).json([]);
    }
});

// Ruta para manejar el envío del formulario de nueva reforma
router.post("/", async (req, res) => {
    // Obtenemos los datos del formulario
    const { year, id_architect } = req.body;

    // Validar que el arquitecto no esté vacío
    if (!id_architect) {
        return res.status(400).json({ success: false, message: "L'arquitecte és obligatori" });
    }

    try {
        // Insertar la nueva reforma
        await ReformModel.create({
            year: parseInt(year),
            id_architect: parseInt(id_architect)
        });

        return res.json({ success: true, message: "Reforma guardada correctament!" });
    } catch (err) {
        console.error("Error:", err);
        return res.status(500).json({ success: false, message: "Error intern del servidor" });
    }
});

// Exportar el router para usarlo en index.js
export default router;