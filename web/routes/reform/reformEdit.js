import express from 'express';
import { ReformModel } from '../../models/ReformModel.js';
import { ArchitectModel } from '../../models/ArchitectModel.js';

// Constante y configuración del servidor Express
const router = express.Router();

// Ruta para obtener una reforma por ID para editar
router.get('/:id', async (req, res) => {
    // Obtenemos el id de la reforma
    const id = Number(req.params.id);

    try {
        // Obtenemos la reforma
        const reform = await ReformModel.getById(id);

        if (!reform) {
            return res.status(404).send('Reforma no trobada');
        }

        // Obtener los arquitectos para el formulario de edición
        const architects = await ArchitectModel.getAll();

        res.render('reform/reformEdit', { reform, architects: architects.data });
    } catch (error) {
        console.error('Error fetching reform:', error);
        return res.status(500).send('Error al obtenir dades');
    }
});

// Ruta para actualizar una reforma
router.put('/:id', async (req, res) => {
    // Obtenemos el id de la reforma
    const id = Number(req.params.id);

    // Obtenemos los datos del formulario
    const { year, id_architect } = req.body;

    try {
        // Actualizar la reforma
        await ReformModel.update(id, {
            year: parseInt(year),
            id_architect: parseInt(id_architect)
        });

        res.json({ success: true, message: 'Reforma actualitzada correctament!' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ success: false, message: 'Error intern del servidor' });
    }
});

// Exportar el router para usarlo en index.js
export default router;