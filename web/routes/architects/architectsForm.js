import express from "express";
import { ArchitectModel } from "../../models/ArchitectModel.js";

// Constante y configuración del servidor Express
const router = express.Router();

// Ruta para obtener el formulario de creación de arquitecto
router.get("/", (req, res) => {
    res.render("architects/architectsForm");
});

// Ruta para crear un arquitecto
router.post("/", async (req, res) => {
    // Obtenemos los datos del arquitecto
    const { name, description, birth_year, death_year, nationality } = req.body;

    // Validamos los datos
    if (!name) {
        return res.status(400).json({ success: false, message: "El nom és obligatori" });
    }

    try {
        // Creamos el arquitecto
        await ArchitectModel.create({
            name,
            description: description || null,
            birth_year: birth_year || null,
            death_year: death_year || null,
            nationality: nationality || null
        });

        return res.json({ success: true, message: "Arquitecto guardado correctamente!" });
    } catch (err) {
        return res.status(500).json({ success: false, message: "Error intern del servidor" });
    }
});

// Exportamos el router para usarlo en index.js
export default router;