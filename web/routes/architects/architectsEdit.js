import express from "express";
import { ArchitectModel } from "../../models/ArchitectModel.js";

// Constante y configuración del servidor Express
const router = express.Router();

// Ruta para obtener un arquitecto por ID
router.get("/:id", async (req, res) => {
    // Obtenemos el ID del arquitecto
    const id = Number(req.params.id);
    try {
        // Obtenemos el arquitecto
        const architect = await ArchitectModel.getById(id);
        res.render("architects/architectsEdit", { architect });
    } catch (error) {
        return res.status(404).send("Arquitecte no trobat");
    }
});

// Ruta para actualizar un arquitecto
router.put("/:id", async (req, res) => {
    // Obtenemos el ID del arquitecto
    const id = Number(req.params.id);
    // Obtenemos los datos del arquitecto
    const { name, description, birth_year, death_year, nationality } = req.body;

    try {
        // Actualizamos el arquitecto
        await ArchitectModel.update(id, {
            name,
            description: description || null,
            birth_year: birth_year || null,
            death_year: death_year || null,
            nationality: nationality || null
        });

        return res.json({ success: true, message: "Arquitecte actualitzat correctament!" });
    } catch (err) {
        return res.status(500).json({ success: false, message: "Error intern del servidor" });
    }
});

// Exportamos el router para usarlo en index.js
export default router;