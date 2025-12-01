import express from 'express';
import { PrizeModel } from '../../models/PrizeModel.js';

//Constante y configuración del servidor Express
const router = express.Router();

//Ruta para obtener un premio por ID
router.get('/:id', async (req, res) => {
    //Obtenemos el ID del premio
    const id = Number(req.params.id);
    try {
        //Obtenemos el premio
        const prize = await PrizeModel.getById(id);
        res.render('prizes/prizesEdit', { prize });
    } catch (error) {
        return res.status(404).send('Premi no trobat');
    }
});

//Ruta para actualizar un premio
router.put('/:id', async (req, res) => {
    //Obtenemos el ID del premio
    const id = Number(req.params.id);
    //Obtenemos los datos del premio
    const { name, tipe, year, description } = req.body;

    try {
        //Actualizamos el premio
        await PrizeModel.update(id, {
            name,
            tipe,
            year: year ? parseInt(year) : null,
            description
        });

        res.json({ success: true, message: 'Premi actualitzat correctament!' });
    } catch (err) {
        res.status(500).json({ success: false, message: 'Error intern del servidor' });
    }
});

//Exportamos el router para usarlo en index.js
export default router;