import express from 'express';
import supabase from '../../config.js';

const router = express.Router();

router.get('/:id', async (req, res) => {
    const id = Number(req.params.id);

    const { data: typology, error } = await supabase
        .from('typology')
        .select('*')
        .eq('id_typology', id)
        .single();

    if (error || !typology) {
        console.error('Error fetching typology:', error);
        return res.status(404).send('Tipologia no trobada');
    }

    res.render('typology/typologyEdit', { typology });
});

router.put('/:id', async (req, res) => {
    const id = Number(req.params.id);
    const { name, image } = req.body;

    try {
        const { error } = await supabase
            .from('typology')
            .update({ name, image })
            .eq('id_typology', id);

        if (error) {
            console.error('Error updating typology:', error);
            return res.status(400).json({ success: false, message: 'Error al actualizar la tipologia' });
        }

        res.json({ success: true, message: 'Tipologia actualitzada correctament!' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ success: false, message: 'Error intern del servidor' });
    }
});

export default router;